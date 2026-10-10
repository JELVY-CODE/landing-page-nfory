import type { GalleryItem } from "@/lib/gallery";

// Casos de uso de referencia (no son proyectos entregados a clientes; la sección lo indica).
// Cuando haya proyectos reales, añádelos aquí con sus datos y opcionalmente `image` en /public/images/.
const rag: GalleryItem = {
  id: "rag-support",
  visual: "rag",
  tags: ["Claude", "RAG", "Vector DB", "Helpdesk API"],
  category: {
    es: "IA aplicada · Soporte",
    en: "Applied AI · Support",
    ko: "응용 AI · 고객 지원",
    ja: "応用 AI · サポート",
    zh: "应用 AI · 客服",
    de: "Angewandte KI · Support",
    ru: "Прикладной ИИ · Поддержка",
  },
  title: {
    es: "Agente de soporte con RAG",
    en: "RAG support agent",
    ko: "RAG 기반 고객 지원 에이전트",
    ja: "RAG サポートエージェント",
    zh: "RAG 客服智能体",
    de: "RAG-Support-Agent",
    ru: "Агент поддержки на базе RAG",
  },
  description: {
    es: "Responde tickets y correos consultando la documentación interna, cita sus fuentes y escala a una persona cuando no tiene certeza.",
    en: "Answers tickets and emails using internal documentation, cites its sources and escalates to a human when unsure.",
    ko: "내부 문서를 검색해 티켓과 이메일에 답하고, 출처를 인용하며, 확신이 없을 때는 담당자에게 넘깁니다.",
    ja: "社内ドキュメントを参照してチケットやメールに回答し、出典を示し、確信が持てない場合は担当者にエスカレーションします。",
    zh: "检索内部文档回复工单与邮件，标注信息来源，不确定时转交人工处理。",
    de: "Beantwortet Tickets und E-Mails anhand interner Dokumentation, nennt seine Quellen und übergibt bei Unsicherheit an einen Menschen.",
    ru: "Отвечает на тикеты и письма по внутренней документации, указывает источники и передаёт вопрос человеку, если не уверен.",
  },
};

const pipeline: GalleryItem = {
  id: "data-pipelines",
  visual: "pipeline",
  tags: ["Python", "FastAPI", "Workflows", "PostgreSQL"],
  category: {
    es: "Infraestructura · Datos",
    en: "Infrastructure · Data",
    ko: "인프라 · 데이터",
    ja: "インフラ · データ",
    zh: "基础设施 · 数据",
    de: "Infrastruktur · Daten",
    ru: "Инфраструктура · Данные",
  },
  title: {
    es: "Orquestación de pipelines de datos",
    en: "Data pipeline orchestration",
    ko: "데이터 파이프라인 오케스트레이션",
    ja: "データパイプラインのオーケストレーション",
    zh: "数据管道编排",
    de: "Orchestrierung von Datenpipelines",
    ru: "Оркестрация конвейеров данных",
  },
  description: {
    es: "Sincroniza CRM, ERP y almacén de datos con flujos programados, reintentos automáticos y trazabilidad de cada ejecución.",
    en: "Syncs CRM, ERP and the data warehouse through scheduled workflows with automatic retries and full run traceability.",
    ko: "예약된 워크플로로 CRM, ERP, 데이터 웨어하우스를 동기화하며, 자동 재시도와 실행 이력 추적을 제공합니다.",
    ja: "スケジュールされたワークフローで CRM・ERP・データウェアハウスを同期し、自動リトライと実行ごとのトレーサビリティを備えます。",
    zh: "通过定时工作流同步 CRM、ERP 与数据仓库，支持自动重试并完整追踪每次运行。",
    de: "Synchronisiert CRM, ERP und Data Warehouse über geplante Workflows mit automatischen Wiederholungen und vollständiger Nachvollziehbarkeit.",
    ru: "Синхронизирует CRM, ERP и хранилище данных по расписанию, с автоматическими повторами и полной трассировкой каждого запуска.",
  },
};

const saas: GalleryItem = {
  id: "b2b-saas",
  visual: "saas",
  tags: ["Next.js", "TypeScript", "Billing", "REST API"],
  category: {
    es: "Producto · SaaS",
    en: "Product · SaaS",
    ko: "제품 · SaaS",
    ja: "プロダクト · SaaS",
    zh: "产品 · SaaS",
    de: "Produkt · SaaS",
    ru: "Продукт · SaaS",
  },
  title: {
    es: "Plataforma SaaS B2B",
    en: "B2B SaaS platform",
    ko: "B2B SaaS 플랫폼",
    ja: "B2B SaaS プラットフォーム",
    zh: "B2B SaaS 平台",
    de: "B2B-SaaS-Plattform",
    ru: "B2B SaaS-платформа",
  },
  description: {
    es: "Panel multiempresa con roles, facturación por uso e integraciones vía API, construido sobre una arquitectura documentada.",
    en: "Multi-tenant dashboard with roles, usage-based billing and API integrations, built on a documented architecture.",
    ko: "역할 관리, 사용량 기반 과금, API 연동을 갖춘 멀티테넌트 대시보드로, 문서화된 아키텍처 위에 구축됩니다.",
    ja: "ロール管理、従量課金、API 連携を備えたマルチテナント型ダッシュボード。文書化されたアーキテクチャで構築します。",
    zh: "支持多租户、角色权限、按用量计费与 API 集成的管理平台，基于有完整文档的架构构建。",
    de: "Mandantenfähiges Dashboard mit Rollen, nutzungsbasierter Abrechnung und API-Integrationen auf einer dokumentierten Architektur.",
    ru: "Мультитенантная панель с ролями, оплатой по использованию и интеграциями через API на задокументированной архитектуре.",
  },
};

const docs: GalleryItem = {
  id: "document-processing",
  visual: "docs",
  tags: ["Claude", "OCR", "Guardrails", "ERP API"],
  category: {
    es: "Automatización · Documentos",
    en: "Automation · Documents",
    ko: "자동화 · 문서",
    ja: "自動化 · ドキュメント",
    zh: "自动化 · 文档",
    de: "Automatisierung · Dokumente",
    ru: "Автоматизация · Документы",
  },
  title: {
    es: "Procesamiento inteligente de documentos",
    en: "Intelligent document processing",
    ko: "지능형 문서 처리",
    ja: "インテリジェント文書処理",
    zh: "智能文档处理",
    de: "Intelligente Dokumentenverarbeitung",
    ru: "Интеллектуальная обработка документов",
  },
  description: {
    es: "Extrae datos de facturas y contratos, los valida contra reglas de negocio y los registra en el ERP sin captura manual.",
    en: "Extracts data from invoices and contracts, validates it against business rules and records it in the ERP without manual entry.",
    ko: "송장과 계약서에서 데이터를 추출하고 비즈니스 규칙으로 검증한 뒤, 수작업 없이 ERP에 등록합니다.",
    ja: "請求書や契約書からデータを抽出し、ビジネスルールで検証したうえで、手入力なしで ERP に登録します。",
    zh: "从发票和合同中提取数据，依据业务规则校验后自动录入 ERP，无需人工录入。",
    de: "Extrahiert Daten aus Rechnungen und Verträgen, prüft sie anhand von Geschäftsregeln und erfasst sie ohne manuelle Eingabe im ERP.",
    ru: "Извлекает данные из счетов и договоров, проверяет их по бизнес-правилам и заносит в ERP без ручного ввода.",
  },
};

// Una fila de carrusel; añade más arrays para mostrar filas adicionales.
export const galleryRows: GalleryItem[][] = [[rag, pipeline, saas, docs]];
