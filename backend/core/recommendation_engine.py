import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

def apply_stitch_theme(fig, chart_type, color_idx=0):
    # Cyberpunk/Neon Palette
    palette = ["#00F0FF", "#B900FF", "#00FF66", "#FF007C", "#FFE600"]
    primary_color = palette[color_idx % len(palette)]
    
    fig.update_layout(
        font=dict(family="Inter, sans-serif", color="#8e8ea0", size=10),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        margin=dict(t=10, l=10, r=10, b=10),
        hoverlabel=dict(
            bgcolor="rgba(10,11,13,0.9)",
            font_size=12,
            font_family="Inter, sans-serif",
            bordercolor="rgba(255,255,255,0.1)"
        ),
        xaxis=dict(
            showgrid=False,
            zeroline=False,
            showline=False,
            showticklabels=True,
            tickfont=dict(color="rgba(255,255,255,0.3)"),
        ),
        yaxis=dict(
            showgrid=True,
            gridcolor="rgba(255,255,255,0.03)",
            gridwidth=1,
            zeroline=False,
            showline=False,
            showticklabels=True,
            tickfont=dict(color="rgba(255,255,255,0.3)"),
        ),
        showlegend=False,
        colorway=palette,
        bargap=0.2
    )
    
    if chart_type == "area":
        h = primary_color.lstrip('#')
        rgb = tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
        fill_color = f"rgba({rgb[0]}, {rgb[1]}, {rgb[2]}, 0.4)"
        
        fig.update_traces(
            line_color=primary_color, 
            line_width=2,
            fill='tozeroy',
            fillcolor=fill_color,
            mode='lines',
            line_shape='spline'
        )
    elif chart_type == "treemap":
        fig.update_traces(
            marker=dict(line=dict(width=0)),
            textinfo="label+value",
            textfont=dict(size=14, color="#FFFFFF", family="Inter, sans-serif")
        )
    elif chart_type == "bar":
        fig.update_traces(
            marker_color=primary_color, 
            marker_line_width=0, 
            opacity=0.9
        )
    elif chart_type == "bubble":
        fig.update_traces(
            marker=dict(
                color=primary_color, 
                opacity=0.5, 
                line=dict(width=1, color="rgba(255,255,255,0.2)")
            )
        )
    elif chart_type == "donut":
        fig.update_traces(
            marker=dict(colors=palette),
            textinfo='none',
            hoverinfo='label+percent',
            hole=0.8, # Ultra thin modern donut
            marker_line_color="rgba(0,0,0,0)",
            marker_line_width=0
        )
        
    return fig

def get_chart_recommendations(df: pd.DataFrame, metadata: dict) -> list:
    recommendations = []
    
    # Buckets for diversity
    area_charts = []
    treemap_charts = []
    donut_charts = []
    bubble_charts = []
    hist_charts = []
    
    numeric_cols = [meta for col, meta in metadata.items() if meta['base_type'] == 'numeric' and col != 'Year']
    categorical_cols = [meta for col, meta in metadata.items() if meta['base_type'] in ['categorical', 'text', 'boolean']]
    datetime_cols = [meta for col, meta in metadata.items() if meta['base_type'] == 'datetime' or meta['semantic_hint'] == 'datetime']

    # Rule 1: Time Series -> Area Chart (Looks much better than line)
    if datetime_cols and numeric_cols:
        dt_col = datetime_cols[0] 
        for num_col in numeric_cols:
            # Resample or just aggregate to avoid extreme clutter if there's too much data
            df_agg = df.groupby(dt_col['name'])[num_col['name']].sum().reset_index()
            # If too many points, sample it or take a rolling average to smooth the visual
            if len(df_agg) > 50:
                df_agg[num_col['name']] = df_agg[num_col['name']].rolling(window=max(2, len(df_agg)//50), min_periods=1).mean()
                
            fig = px.area(df_agg, x=dt_col['name'], y=num_col['name'])
            area_charts.append({
                "chart_type": "area",
                "title": f"Trend of {num_col['name']}",
                "x_axis": dt_col['name'],
                "y_axis": num_col['name'],
                "score": 10,
                "explanation": f"Area charts are striking ways to visualize volume over time.",
                "fig": fig
            })

    # Rule 2: Categorical -> Treemap & Donut
    if categorical_cols and numeric_cols:
        for cat_col in categorical_cols:
            if cat_col['unique_count'] > 30: continue 
            
            num_col = numeric_cols[0]
            df_agg = df.groupby(cat_col['name'])[num_col['name']].sum().reset_index()
            df_agg = df_agg.sort_values(by=num_col['name'], ascending=False)
            
            # Treemap is highly visual and modern
            df_agg_tree = df_agg.head(8).copy() # Reduced to 8 for cleaner look
            df_agg_tree['root'] = 'Total'
            fig_tree = px.treemap(df_agg_tree, path=['root', cat_col['name']], values=num_col['name'])
            treemap_charts.append({
                "chart_type": "treemap",
                "title": f"Heatmap: {num_col['name']} by {cat_col['name']}",
                "x_axis": cat_col['name'],
                "y_axis": num_col['name'],
                "score": 10 if cat_col['unique_count'] < 15 else 7,
                "explanation": f"Treemaps are highly visual for comparing proportional compositions.",
                "fig": fig_tree
            })
            
            if cat_col['unique_count'] <= 6:
                fig_donut = px.pie(df_agg, names=cat_col['name'], values=num_col['name'])
                donut_charts.append({
                    "chart_type": "donut",
                    "title": f"Composition of {cat_col['name']}",
                    "x_axis": cat_col['name'],
                    "y_axis": num_col['name'],
                    "score": 5,
                    "explanation": f"Ultra-thin donuts show elegant part-to-whole relationships.",
                    "fig": fig_donut
                })

    # Rule 3: Correlation -> Bubble Chart (if 3 numeric available, else scatter)
    if len(numeric_cols) >= 2:
        num1 = numeric_cols[0]
        num2 = numeric_cols[1]
        
        df_sample = df.sample(min(300, len(df))) if len(df) > 300 else df.copy() # Reduced sample size for less clutter
        
        if len(numeric_cols) >= 3:
            num3 = numeric_cols[2]
            # Plotly size parameter cannot handle NaNs or negative values. 
            # We create a temporary safe column.
            safe_size_col = f"{num3['name']}_safe_size"
            df_sample[safe_size_col] = df_sample[num3['name']].fillna(0).clip(lower=0)
            
            fig = px.scatter(df_sample, x=num1['name'], y=num2['name'], size=safe_size_col, hover_name=num3['name'], size_max=25)
            chart_type = "bubble"
            title = f"Multi-variate Analysis"
        else:
            fig = px.scatter(df_sample, x=num1['name'], y=num2['name'])
            chart_type = "bubble"
            title = f"Correlation: {num1['name']} vs {num2['name']}"
            
        bubble_charts.append({
            "chart_type": chart_type,
            "title": title,
            "x_axis": num1['name'],
            "y_axis": num2['name'],
            "score": 10,
            "explanation": f"Bubble charts add a 3rd dimension to standard correlations.",
            "fig": fig
        })

    # Rule 4: Distribution -> Styled Bar/Histogram
    if numeric_cols:
        num_col = numeric_cols[-1]
        fig = px.histogram(df, x=num_col['name'], nbins=30)
        hist_charts.append({
            "chart_type": "bar",
            "title": f"Distribution Profile of {num_col['name']}",
            "x_axis": num_col['name'],
            "y_axis": "Count",
            "score": 8,
            "explanation": f"Sleek bars visualize frequency distribution.",
            "fig": fig
        })
        
    # Assemble a diverse dashboard
    color_idx = 0
    final_recs = []
    
    # Try to pick 1-2 area charts
    for c in area_charts[:2]:
        c['fig_json'] = apply_stitch_theme(c['fig'], c['chart_type'], color_idx).to_json()
        del c['fig']
        final_recs.append(c)
        color_idx += 1
        
    # Add a treemap chart
    if treemap_charts:
        c = treemap_charts[0]
        c['fig_json'] = apply_stitch_theme(c['fig'], c['chart_type'], color_idx).to_json()
        del c['fig']
        final_recs.append(c)
        color_idx += 1
        
    # Add a donut chart
    if donut_charts:
        c = donut_charts[0]
        c['fig_json'] = apply_stitch_theme(c['fig'], c['chart_type'], color_idx).to_json()
        del c['fig']
        final_recs.append(c)
        color_idx += 1
        
    # Add a bubble chart
    if bubble_charts and len(final_recs) < 5:
        c = bubble_charts[0]
        c['fig_json'] = apply_stitch_theme(c['fig'], c['chart_type'], color_idx).to_json()
        del c['fig']
        final_recs.append(c)
        color_idx += 1
        
    # Add a histogram if we still need one
    if hist_charts and len(final_recs) < 5:
        c = hist_charts[0]
        c['fig_json'] = apply_stitch_theme(c['fig'], c['chart_type'], color_idx).to_json()
        del c['fig']
        final_recs.append(c)
        color_idx += 1

    return final_recs
