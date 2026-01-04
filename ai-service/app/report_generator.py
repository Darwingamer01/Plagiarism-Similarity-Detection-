from typing import Dict, Any, List, Optional

class ReportGenerator:
    def generate_report(self, query_meta: Dict[str, Any], match_meta: Dict[str, Any], similarity_score: float, aggregate_score: float = 0.0, overall_score: float = 0.0) -> Dict[str, Any]:
        """
        Generate a detailed comparison report between two documents.
        """
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
        
        # --- Thought Process Generation ---
        thought_process = []
        thought_process.append("### AI Score Analysis")
        thought_process.append(f"**Overall Score ({overall_score*100:.1f}%)**: A weighted composite score aiming to balance the severity of matches with the volume of plagiarism. (Calculated as 60% Aggregate + 40% Max).")
        thought_process.append(f"**Max Similarity ({similarity_score*100:.1f}%)**: Represents peak risk—the single highest matching block found.")
        thought_process.append(f"**Aggregate Score ({aggregate_score*100:.1f}%)**: Represents volume—the total percentage of your document containing matches.")

        # Synthesis
        if similarity_score > 0.90 and aggregate_score < 0.40:
             thought_process.append(f"**Conclusion**: **High Risk in Specific Sections**. While the overall score is moderate ({overall_score*100:.0f}%), the Max Similarity of {similarity_score*100:.0f}% indicates direct copying in specific paragraphs, even though they only make up ~{aggregate_score*100:.0f}% of the text.")
        elif similarity_score > 0.85 and aggregate_score > 0.70:
             thought_process.append("**Conclusion**: **Systemic Plagiarism**. All metrics are high, indicating the document is likely a duplicate or major derivative.")
        elif similarity_score < 0.50:
             thought_process.append("**Conclusion**: **Unique Content**. Scores are low across the board, suggesting incidental overlap only.")
        else:
             thought_process.append(f"**Conclusion**: **Moderate Overlap**. approx. {aggregate_score*100:.0f}% of the content matches, resulting in an overall score of {overall_score*100:.1f}%.")
             
        # Comprehensive Paragraph Explanation
        explanation = []
        explanation.append(f"This document presents an **Overall Plagiarism Score of {overall_score*100:.1f}%**, which is a weighted metric derived from two key factors: the volume of matching content ({aggregate_score*100:.1f}%) and the severity of the highest match found ({similarity_score*100:.1f}%).")
        
        if similarity_score > 0.85:
             explanation.append("The analysis detected **significant, verbatim matching** in specific sections (indicated by the high Max Similarity), suggesting that parts of the text may have been directly copied from the source document.")
        elif similarity_score > 0.60:
             explanation.append("The analysis found **moderate similarity**, likely indicating paraphrasing or structure preservation rather than direct copying.")
        else:
             explanation.append("The matching segments are superficial, likely due to common terminology rather than plagiarism.")

        if aggregate_score < 0.30 and similarity_score > 0.80:
             explanation.append(f"Although the total volume of matches is relatively low ({aggregate_score*100:.0f}%), the matches that do exist are **highly identical**, which is characteristic of 'patchwork plagiarism' where specific paragraphs are lifted while the rest of the document differs.")
        elif aggregate_score > 0.60:
             explanation.append(f"The high volume of matches ({aggregate_score*100:.0f}%) indicates that a majority of the document's structure and content overlaps with the source, suggesting it may be a derivative work or heavy revision of the existing file.")
        
        explanation.append("The 'Overall Score' prioritizes these factors to give a balanced risk assessment, preventing small but copied sections from being ignored (which a simple average might miss) while also contextualizing high-match peaks that might be isolated.")
        
        thought_process.append("\n" + " ".join(explanation))
             
        # Content Analysis
        relevant_themes = [] # Initialize here to ensure it's always defined
        if intersection:
            topics = ", ".join(list(intersection)[:3])
            thought_process.append(f"**Thematic Overlap**: The shared score is driven by common discussions on: {topics}.")
        elif similarity_score > 0.60:
             relevant_themes = list(query_context)[:2] + list(match_context)[:2]
             if relevant_themes:
                 themes_str = ", ".join(relevant_themes)
                 thought_process.append(f"**Thematic Overlap**: Despite lacking exact keyword matches, Deep semantic analysis found alignment in: {themes_str}.")

        # --- Standard Reasoning (kept for backward compatibility/summary) ---
        reasoning = []
        if similarity_score > 0.85:
            reasoning.append(f"CRITICAL MATCH ({similarity_score*100:.1f}%): This document exhibits an extremely high degree of similarity in the matching sections.")
        elif similarity_score > 0.70:
            reasoning.append(f"HIGH MATCH ({similarity_score*100:.1f}%): Significant portions of text match or share identical phrasing.")
        elif similarity_score > 0.50:
            reasoning.append(f"MODERATE MATCH ({similarity_score*100:.1f}%): Clear overlap in specific topics and sentence structures.")
        else:
            reasoning.append(f"LOW MATCH ({similarity_score*100:.1f}%): Mostly semantic distinction with minor vocabulary overlap.")

        # Logic for Shared Context reporting
        common_topics_display = list(intersection)
        if intersection:
            topics = ", ".join(list(intersection)[:3])
            reasoning.append(f"Heavily discusses: {topics}.")
        elif similarity_score > 0.60:
             if relevant_themes: # Re-use calculated themes
                 themes_str = ", ".join(relevant_themes)
                 reasoning.append(f"Deep conceptual overlap in: {themes_str}.")
                 common_topics_display = relevant_themes
             else:
                 reasoning.append("The high similarity score suggests strong conceptual alignment despite different specific terminology.")
        else:
            reasoning.append("Despite some textual similarity, the key thematic topics differ, suggesting incidental overlap rather than systemic copying.")

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
