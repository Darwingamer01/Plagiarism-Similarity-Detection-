from typing import Dict, Any, List, Optional

class ReportGenerator:
    def generate_report(self, query_meta: Dict[str, Any], match_meta: Dict[str, Any], similarity_score: float, overall_score: float = 0.0, matches: List[Dict] = None) -> Dict[str, Any]:
        """
        Generate a detailed comparison report between two documents.
        Uses simplified weighted mean scoring.
        """
        if matches is None:
            matches = []
            
        # 1. Context Extraction
        query_context = set()
        if query_meta.get('context'):
            ctx = query_meta['context']
            if isinstance(ctx, list) and ctx and isinstance(ctx[0], dict):
                query_context = set([k.get('text', '') for k in ctx if k.get('text')])
            elif isinstance(ctx, list):
                query_context = set([str(c) for c in ctx])
        
        match_context = set()
        if match_meta.get('context'):
            ctx = match_meta['context']
            if isinstance(ctx, list) and ctx and isinstance(ctx[0], dict):
                match_context = set([k.get('text', '') for k in ctx if k.get('text')])
            elif isinstance(ctx, list):
                match_context = set([str(c) for c in ctx])

        intersection = query_context.intersection(match_context)
        
        # 2. Sentiment Comparison
        q_sent = query_meta.get('sentiment', {}) or {}
        m_sent = match_meta.get('sentiment', {}) or {}
        
        q_label = q_sent.get('label', 'UNKNOWN')
        m_label = m_sent.get('label', 'UNKNOWN')
        sentiment_match = q_label == m_label
        
        # 3. Generate Analysis & Thought Process
        
        # --- Thought Process Generation (Simple language, easy to understand) ---
        thought_process = []
        thought_process.append("### Understanding Your Scores")
        
        # Explain both scores in simple terms
        thought_process.append(f"**This Document: {similarity_score*100:.0f}%** — How much of your content matches THIS specific source.")
        thought_process.append(f"**Overall Score: {overall_score*100:.0f}%** — How much of your content matches ANY source in our database.")
        
        thought_process.append("---")
        thought_process.append("### What We Found")
        
        # Main finding based on document score
        # Main finding based on document score
        if similarity_score >= 0.85:
            thought_process.append(f"**Result: Severe / Near-Duplicate**")
            thought_process.append(f"We found that **{similarity_score*100:.1f}%** of the content is effectively identical or highly derived from this source. This indicates a critical level of plagiarism.")
        elif similarity_score >= 0.75:
            thought_process.append(f"**Result: Probable Plagiarism**")
            thought_process.append(f"We found **{similarity_score*100:.1f}%** similarity. This suggests significant portions of the document are heavily based on this source.")
        elif similarity_score >= 0.60:
            thought_process.append(f"**Result: High Similarity**")
            thought_process.append(f"We found **{similarity_score*100:.1f}%** similarity. Several sections share strong structural and topical overlap.")
        elif similarity_score >= 0.40:
            thought_process.append(f"**Result: Partial Overlap**")
            thought_process.append(f"We found **{similarity_score*100:.1f}%** similarity. Some sections of your document have similar content, but it may be limited to specific topics.")
        elif similarity_score >= 0.20:
             thought_process.append(f"**Result: Low Similarity**")
             thought_process.append(f"Only **{similarity_score*100:.1f}%** similarity was found. This likely reflects common terminology or broad topical alignment.")
        else:
            thought_process.append(f"**Result: Unrelated**")
            thought_process.append(f"Less than **{similarity_score*100:.1f}%** similarity found. The documents appear unrelated.")
        
        # --- NEW: Detailed Analysis Section ---
        thought_process.append("---")
        thought_process.append("### Detailed Analysis")
        
        if matches and len(matches) > 0:
            # Analyze the matches
            high_matches = [m for m in matches if m.get('similarity', 0) > 0.90]
            moderate_matches = [m for m in matches if 0.70 < m.get('similarity', 0) <= 0.90]
            low_matches = [m for m in matches if m.get('similarity', 0) <= 0.70]
            
            thought_process.append(f"We compared **{len(matches)} sections** of your document against this source:")
            
            if high_matches:
                thought_process.append(f"• **{len(high_matches)} sections** have very high similarity (90%+) — These are nearly word-for-word matches.")
            if moderate_matches:
                thought_process.append(f"• **{len(moderate_matches)} sections** have strong similarity (70-90%) — These share the same ideas and structure, even if words were changed.")
            if low_matches:
                thought_process.append(f"• **{len(low_matches)} sections** have partial similarity — These discuss similar concepts but differ in execution.")
            
            # What type of similarity was found
            thought_process.append("")
            if similarity_score >= 0.85:
                # User specifically requested this distinction
                thought_process.append("**Type of Similarity**: The matching content shows **deep semantic alignment**. Even if the vocabulary has been changed (paraphrasing), the sentence structure, logical flow, and core ideas remain the same.")
            elif similarity_score >= 0.70:
                thought_process.append("**Type of Similarity**: The matching content shows **significant paraphrasing**. The ideas are the same, expressed using different wording (structural and conceptual overlap).")
            elif similarity_score >= 0.50:
                thought_process.append("**Type of Similarity**: The overlap appears to be **topical similarity**. Both documents discuss similar subjects but approach them differently.")
            else:
                thought_process.append("**Type of Similarity**: The minimal overlap is likely due to **common terminology** or standard phrases used in this subject area.")
            
            # Summarize what the matching content is about
            if matches:
                # Get a preview of what's being matched
                sample_match = matches[0]
                query_preview = sample_match.get('query_text', '')[:100]
                if query_preview:
                    thought_process.append("")
                    thought_process.append(f"**Sample of Matched Content**: \"{query_preview}...\"")
        else:
            thought_process.append("No specific matching sections were identified for detailed analysis.")
        
        # Why does this matter? (In-depth but simple)
        thought_process.append("---")
        thought_process.append("### Why This Matters")
        
        if similarity_score >= 0.75:
             thought_process.append("This level of similarity typically requires immediate attention. It suggests the document is not original work. You must review the matches below.")
        elif similarity_score >= 0.40:
            thought_process.append("Portions of this document overlap with the source. Review the matched sections to decide if they need to be rewritten or cited.")
        else:
            thought_process.append("This level of similarity is generally acceptable and likely coincidental.")
             
        # Content Analysis - What topics are shared
        relevant_themes = []
        if intersection:
            topics = ", ".join(list(intersection)[:3])
            thought_process.append(f"**Topics in Common**: {topics}")
        elif similarity_score > 0.60:
            relevant_themes = list(query_context)[:2] + list(match_context)[:2]
            if relevant_themes:
                themes_str = ", ".join(relevant_themes)
                thought_process.append(f"**Related Topics Found**: {themes_str}")

        # --- Standard Reasoning (findings-focused) ---
        reasoning = []
        if similarity_score > 0.85:
            reasoning.append(f"High similarity ({similarity_score*100:.0f}%): Multiple passages closely match this source.")
        elif similarity_score > 0.70:
            reasoning.append(f"Notable similarity ({similarity_score*100:.0f}%): Several sections share similar content with this source.")
        elif similarity_score > 0.50:
            reasoning.append(f"Some similarity ({similarity_score*100:.0f}%): A few sections overlap with this source.")
        else:
            reasoning.append(f"Low similarity ({similarity_score*100:.0f}%): Minimal overlap found.")

        # Topics found
        common_topics_display = list(intersection)
        if intersection:
            topics = ", ".join(list(intersection)[:3])
            reasoning.append(f"Shared topics: {topics}.")
        elif similarity_score > 0.60:
            if relevant_themes:
                themes_str = ", ".join(relevant_themes)
                reasoning.append(f"Related topics found: {themes_str}.")
                common_topics_display = relevant_themes
        else:
            reasoning.append("No significant thematic overlap detected.")

        # Summary-based reasoning
        q_summary = query_meta.get('summary')
        m_summary = match_meta.get('metadata', {}).get('summary') if 'metadata' in match_meta else match_meta.get('summary')
        
        if q_summary and m_summary:
             # Simple heuristic: if both summaries are present, mention that AI compared them
             reasoning.append(" AI has analyzed the generated summaries of both documents and detected consistent narrative flows.")

        if sentiment_match:
            reasoning.append(f"Both share a {q_label} tone.")
        else:
            reasoning.append(f"However, the tone differs ({q_label} vs {m_label}), suggesting they may be approaching the subject from different angles.")

        return {
            "reasoning": " ".join(reasoning),
            "thought_process": "\n\n".join(thought_process),
            "intersection": list(intersection),
            "sentiment_match": sentiment_match,
            "query_sentiment": q_label,
            "match_sentiment": m_label,
            "comparison": {
                "sentiment_contrast": {
                     "query": q_label,
                     "match": m_label,
                     "match_status": "MATCH" if sentiment_match else "MISMATCH"
                },
                "common_topics": common_topics_display,
                "query_unique_topics": list(query_context - match_context),
                "match_unique_topics": list(match_context - query_context)
            }
        }

    def generate_no_match_report(self, query_meta: Dict[str, Any], closest_match: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Generate a report explaining why NO matches were found.
        """
        reasoning = []
        reasoning.append("UNIQUE CONTENT DETECTED. Analysis confirms that your document is distinct from our database.")
        
        # Query context string
        q_ctx_list = []
        if query_meta.get('context'):
             ctx = query_meta['context']
             if isinstance(ctx, list) and ctx and isinstance(ctx[0], dict):
                 q_ctx_list = [k.get('text', '') for k in ctx if k.get('text')]
             elif isinstance(ctx, list):
                 q_ctx_list = [str(c) for c in ctx]
        
        if q_ctx_list:
            reasoning.append(f"Your document focuses on specific themes ({', '.join(q_ctx_list[:3])}) that do not appear in any other indexed files.")

        if closest_match:
            score = closest_match.get('similarity', 0) * 100
            match_meta = closest_match.get('metadata', {})
            
            # Match context string
            m_ctx_list = []
            if match_meta.get('context'):
                ctx = match_meta['context']
                if isinstance(ctx, list) and ctx and isinstance(ctx[0], dict):
                    m_ctx_list = [k.get('text', '') for k in ctx if k.get('text')]
                elif isinstance(ctx, list):
                    m_ctx_list = [str(c) for c in ctx]
            
            m_str = ", ".join(m_ctx_list[:5]) if m_ctx_list else "general topics"
            
            reasoning.append(f"\n\nClosest Match Analysis:")
            reasoning.append(f"We compared your document against the closest available match in the database, which scored only {score:.1f}%.")
            reasoning.append(f"The matched document focuses on: {m_str}.")
            reasoning.append(f"Your document, in contrast, discusses: {', '.join(q_ctx_list[:5]) if q_ctx_list else 'distinct topics'}.")
            reasoning.append("The divergence in these key themes confirms that the content is semantically unrelated.")
        else:
             reasoning.append("No other documents were found in the index for comparison.")
        
        return {
            "reasoning": " ".join(reasoning),
            "closest_match": closest_match
        }
