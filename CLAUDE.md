# AI-VIZ — Financial Data Visualization Platform

## Project Overview
金融数据可视化平台，作为作品展示 + ai-finance 项目的可视化层。

## Tech Stack
- **数据采集**: Python 3.13 + AKShare + yfinance + Tushare
- **数据处理**: Polars + DuckDB
- **数据存储**: DuckDB (本地) + Turso (线上) + JSON (静态)
- **前端**: Next.js (Static Export) + ECharts + Tailwind CSS
- **CI/CD**: GitHub Actions (定时采集 + 部署)
- **包管理**: UV (Python) + pnpm (Node)

## Data Architecture
分层架构: ODS (raw) → DWD (processed) → DWS (aggregated) → Presentation
- 维度建模 (Star Schema)
- 语义层定义在 src/models/semantic/

## Key Conventions
- Python code follows PEP 8
- Data files: Parquet for storage, JSON for frontend consumption
- API keys in .env (NEVER commit)
- All data collectors inherit from BaseCollector class
- Use Polars (not pandas) for data processing

## Related Projects
- ../ai-finance — 金融分析/量化引擎，本项目的数据消费者

## Commands
- `uv run python -m src.pipeline.daily` — 运行每日数据采集
- `cd frontend && pnpm dev` — 启动前端开发服务器
