import type { Locale } from "@/lib/i18n/config";

export const PRIVACY_UPDATED = "2026-10-10";

export type PrivacySection = { heading: string; paragraphs?: string[]; list?: string[]; after?: string[] };

export type PrivacyContent = {
  title: string;
  metaDescription: string;
  updated: string;
  back: string;
  intro: string;
  sections: PrivacySection[];
};

export const privacy: Record<Locale, PrivacyContent> = {
  es: {
    title: "Política de privacidad",
    metaDescription: "Cómo NFory trata los datos personales de quienes visitan nfory.com o nos contactan.",
    updated: "Última actualización",
    back: "Volver al inicio",
    intro:
      "En NFory respetamos tu privacidad. Esta política explica qué datos personales tratamos cuando visitas nfory.com o nos escribes, para qué los usamos y cómo puedes ejercer tus derechos.",
    sections: [
      {
        heading: "Responsable del tratamiento",
        paragraphs: ["NFory es responsable del tratamiento de tus datos personales. Para cualquier asunto relacionado con privacidad puedes escribirnos a {email}."],
      },
      {
        heading: "Datos que recabamos",
        paragraphs: ["Solo tratamos los datos que nos proporcionas o que son necesarios para el funcionamiento del sitio:"],
        list: [
          "Formulario de contacto: nombre, correo electrónico, empresa (opcional), servicio de interés, preferencia de fecha y horario, y el mensaje que nos envías.",
          "Datos técnicos: dirección IP y datos del navegador, utilizados para proteger el formulario frente a abusos y mantener la seguridad del sitio.",
          "Analítica: solo si das tu consentimiento, Google Analytics recopila información sobre cómo usas el sitio (páginas visitadas, duración de la visita, tipo de dispositivo y ubicación aproximada).",
        ],
      },
      {
        heading: "Finalidades",
        list: [
          "Responder a tu solicitud y agendar la consultoría.",
          "Enviarte una confirmación de que recibimos tu solicitud.",
          "Proteger el sitio y el formulario frente a spam y usos fraudulentos.",
          "Entender cómo se usa el sitio para mejorarlo, solo si aceptas las cookies de analítica.",
        ],
        after: ["No usamos tus datos para publicidad ni los vendemos a terceros."],
      },
      {
        heading: "Base legal",
        paragraphs: [
          "Tratamos los datos del formulario para atender la solicitud que tú inicias y los datos de analítica únicamente con tu consentimiento, que puedes retirar en cualquier momento. La protección del sitio se basa en nuestro interés legítimo en mantenerlo seguro.",
        ],
      },
      {
        heading: "Proveedores que nos ayudan",
        paragraphs: ["Compartimos datos solo con proveedores que los tratan por cuenta nuestra y con sus propias garantías de seguridad:"],
        list: [
          "Vercel: alojamiento del sitio web.",
          "Resend: envío de los correos del formulario.",
          "Cloudflare: DNS, seguridad y verificación anti-bots (Turnstile).",
          "Google Analytics: medición del uso del sitio, solo con tu consentimiento.",
        ],
        after: [
          "Algunos de estos proveedores pueden tratar datos fuera de tu país; en esos casos se aplican las garantías previstas por la normativa aplicable, como las cláusulas contractuales tipo.",
        ],
      },
      {
        heading: "Conservación",
        paragraphs: [
          "Conservamos los datos de cada solicitud el tiempo necesario para atenderla y, si iniciamos una relación comercial, mientras dure y durante los plazos legales aplicables. Si no hay relación comercial, los eliminamos en un plazo máximo de 12 meses. Los datos de analítica se conservan un máximo de 14 meses.",
        ],
      },
      {
        heading: "Cookies",
        paragraphs: [
          "Este sitio no usa cookies propias de seguimiento. Las cookies de Google Analytics solo se instalan si las aceptas en el aviso de cookies. Además, tu navegador guarda tu elección de cookies y tu idioma preferido para recordar tus preferencias. Puedes cambiar tu elección en cualquier momento desde el enlace «Cookies» del pie de página.",
        ],
      },
      {
        heading: "Tus derechos",
        paragraphs: ["Puedes ejercer en cualquier momento tus derechos de:"],
        list: [
          "Acceso a tus datos.",
          "Rectificación de datos inexactos.",
          "Cancelación o supresión.",
          "Oposición y limitación del tratamiento.",
          "Portabilidad.",
          "Revocación del consentimiento.",
        ],
        after: [
          "Para ejercerlos, escríbenos a {email} indicando tu solicitud; te responderemos en un plazo máximo de 20 días hábiles. También puedes presentar una reclamación ante la autoridad de protección de datos de tu país.",
        ],
      },
      {
        heading: "Seguridad",
        paragraphs: [
          "Aplicamos medidas técnicas y organizativas para proteger tus datos: conexión cifrada (HTTPS), cabeceras de seguridad, protección anti-bots en el formulario y acceso restringido a la información.",
        ],
      },
      {
        heading: "Cambios en esta política",
        paragraphs: ["Podemos actualizar esta política para reflejar cambios en el sitio o en la normativa. Publicaremos cualquier cambio en esta página con su fecha de actualización."],
      },
    ],
  },
  en: {
    title: "Privacy policy",
    metaDescription: "How NFory handles the personal data of people who visit nfory.com or contact us.",
    updated: "Last updated",
    back: "Back to home",
    intro:
      "At NFory we respect your privacy. This policy explains what personal data we process when you visit nfory.com or write to us, what we use it for and how you can exercise your rights.",
    sections: [
      {
        heading: "Data controller",
        paragraphs: ["NFory is the controller of your personal data. For any privacy-related matter you can write to us at {email}."],
      },
      {
        heading: "Data we collect",
        paragraphs: ["We only process the data you provide to us or that is necessary for the site to work:"],
        list: [
          "Contact form: name, email address, company (optional), service of interest, preferred date and time, and the message you send us.",
          "Technical data: IP address and browser data, used to protect the form against abuse and keep the site secure.",
          "Analytics: only if you consent, Google Analytics collects information about how you use the site (pages visited, visit duration, device type and approximate location).",
        ],
      },
      {
        heading: "Purposes",
        list: [
          "Responding to your request and scheduling the consultation.",
          "Sending you a confirmation that we received your request.",
          "Protecting the site and the form against spam and fraudulent use.",
          "Understanding how the site is used in order to improve it, only if you accept analytics cookies.",
        ],
        after: ["We do not use your data for advertising and we do not sell it to third parties."],
      },
      {
        heading: "Legal basis",
        paragraphs: [
          "We process form data to handle the request you initiate, and analytics data only with your consent, which you can withdraw at any time. Protecting the site is based on our legitimate interest in keeping it secure.",
        ],
      },
      {
        heading: "Providers that help us",
        paragraphs: ["We only share data with providers that process it on our behalf under their own security safeguards:"],
        list: [
          "Vercel: website hosting.",
          "Resend: delivery of form emails.",
          "Cloudflare: DNS, security and bot verification (Turnstile).",
          "Google Analytics: measuring site usage, only with your consent.",
        ],
        after: [
          "Some of these providers may process data outside your country; in those cases the safeguards required by applicable law apply, such as standard contractual clauses.",
        ],
      },
      {
        heading: "Retention",
        paragraphs: [
          "We keep the data of each request for as long as needed to handle it and, if we start a business relationship, for its duration and the applicable legal periods. If there is no business relationship, we delete it within 12 months at most. Analytics data is kept for a maximum of 14 months.",
        ],
      },
      {
        heading: "Cookies",
        paragraphs: [
          "This site does not use its own tracking cookies. Google Analytics cookies are only set if you accept them in the cookie notice. Your browser also stores your cookie choice and preferred language to remember your preferences. You can change your choice at any time from the “Cookies” link in the footer.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: ["You can exercise your rights at any time to:"],
        list: [
          "Access your data.",
          "Rectify inaccurate data.",
          "Erasure.",
          "Object to or restrict processing.",
          "Data portability.",
          "Withdraw your consent.",
        ],
        after: [
          "To exercise them, write to us at {email} stating your request; we will reply within 20 business days at most. You may also lodge a complaint with the data protection authority in your country.",
        ],
      },
      {
        heading: "Security",
        paragraphs: [
          "We apply technical and organizational measures to protect your data: encrypted connections (HTTPS), security headers, bot protection on the form and restricted access to information.",
        ],
      },
      {
        heading: "Changes to this policy",
        paragraphs: ["We may update this policy to reflect changes to the site or to the law. Any changes will be published on this page with their update date."],
      },
    ],
  },
  ko: {
    title: "개인정보 처리방침",
    metaDescription: "NFory가 nfory.com 방문자 및 문의자의 개인정보를 처리하는 방법.",
    updated: "최종 업데이트",
    back: "홈으로 돌아가기",
    intro:
      "NFory는 귀하의 개인정보를 존중합니다. 본 방침은 귀하가 nfory.com을 방문하거나 문의할 때 어떤 개인정보를 처리하는지, 어떤 목적으로 사용하는지, 그리고 귀하의 권리를 어떻게 행사할 수 있는지 설명합니다.",
    sections: [
      {
        heading: "개인정보 처리 책임자",
        paragraphs: ["NFory는 귀하의 개인정보 처리에 대한 책임을 집니다. 개인정보 관련 문의는 {email}로 연락해 주십시오."],
      },
      {
        heading: "수집하는 정보",
        paragraphs: ["귀하가 제공하거나 사이트 운영에 필요한 정보만 처리합니다:"],
        list: [
          "문의 양식: 이름, 이메일 주소, 회사(선택), 관심 서비스, 희망 날짜 및 시간대, 보내주신 메시지.",
          "기술 정보: 양식을 남용으로부터 보호하고 사이트 보안을 유지하기 위한 IP 주소 및 브라우저 정보.",
          "분석: 귀하가 동의한 경우에만 Google Analytics가 사이트 이용 방식(방문 페이지, 방문 시간, 기기 유형, 대략적인 위치)에 대한 정보를 수집합니다.",
        ],
      },
      {
        heading: "이용 목적",
        list: [
          "문의에 답변하고 컨설팅 일정을 잡기 위해.",
          "문의 접수 확인 메일을 보내기 위해.",
          "스팸 및 부정 사용으로부터 사이트와 양식을 보호하기 위해.",
          "분석 쿠키에 동의한 경우에 한해, 사이트 이용 방식을 파악하여 개선하기 위해.",
        ],
        after: ["귀하의 정보를 광고에 사용하거나 제3자에게 판매하지 않습니다."],
      },
      {
        heading: "처리의 법적 근거",
        paragraphs: [
          "양식 정보는 귀하가 요청한 문의를 처리하기 위해, 분석 정보는 언제든 철회할 수 있는 귀하의 동의가 있는 경우에만 처리합니다. 사이트 보호는 사이트를 안전하게 유지하려는 당사의 정당한 이익에 근거합니다.",
        ],
      },
      {
        heading: "협력 서비스 제공자",
        paragraphs: ["당사를 대신하여 자체 보안 기준에 따라 정보를 처리하는 제공자와만 정보를 공유합니다:"],
        list: [
          "Vercel: 웹사이트 호스팅.",
          "Resend: 문의 양식 이메일 발송.",
          "Cloudflare: DNS, 보안 및 봇 검증(Turnstile).",
          "Google Analytics: 동의한 경우에 한한 사이트 이용 측정.",
        ],
        after: ["일부 제공자는 귀하의 국가 외부에서 정보를 처리할 수 있으며, 이 경우 표준 계약 조항 등 관련 법령이 정한 보호 조치가 적용됩니다."],
      },
      {
        heading: "보관 기간",
        paragraphs: [
          "각 문의 정보는 처리에 필요한 기간 동안 보관하며, 거래 관계가 시작되면 그 기간 및 관련 법정 기간 동안 보관합니다. 거래 관계가 없는 경우 최대 12개월 이내에 삭제합니다. 분석 정보는 최대 14개월간 보관됩니다.",
        ],
      },
      {
        heading: "쿠키",
        paragraphs: [
          "본 사이트는 자체 추적 쿠키를 사용하지 않습니다. Google Analytics 쿠키는 쿠키 안내에서 동의한 경우에만 설정됩니다. 또한 귀하의 설정을 기억하기 위해 브라우저에 쿠키 선택과 선호 언어가 저장됩니다. 하단의 「쿠키」 링크에서 언제든 선택을 변경할 수 있습니다.",
        ],
      },
      {
        heading: "귀하의 권리",
        paragraphs: ["귀하는 언제든지 다음 권리를 행사할 수 있습니다:"],
        list: ["개인정보 열람.", "부정확한 정보의 정정.", "삭제.", "처리에 대한 반대 및 제한.", "개인정보 이동.", "동의 철회."],
        after: ["권리 행사를 원하시면 {email}로 요청 내용을 보내 주십시오. 최대 20영업일 이내에 답변드립니다. 또한 거주 국가의 개인정보 보호 기관에 이의를 제기할 수 있습니다."],
      },
      {
        heading: "보안",
        paragraphs: ["암호화된 연결(HTTPS), 보안 헤더, 양식의 봇 방지 및 정보 접근 제한 등 기술적·관리적 조치를 통해 귀하의 정보를 보호합니다."],
      },
      {
        heading: "방침 변경",
        paragraphs: ["사이트 또는 법령의 변경 사항을 반영하기 위해 본 방침을 업데이트할 수 있습니다. 변경 사항은 업데이트 날짜와 함께 이 페이지에 게시됩니다."],
      },
    ],
  },
  ja: {
    title: "プライバシーポリシー",
    metaDescription: "nfory.com の訪問者およびお問い合わせいただいた方の個人データを NFory がどのように取り扱うか。",
    updated: "最終更新日",
    back: "ホームに戻る",
    intro:
      "NFory はお客様のプライバシーを尊重します。本ポリシーでは、nfory.com へのアクセスやお問い合わせの際に当社が取り扱う個人データ、その利用目的、およびお客様の権利の行使方法について説明します。",
    sections: [
      {
        heading: "個人データの管理者",
        paragraphs: ["NFory はお客様の個人データの管理者です。プライバシーに関するお問い合わせは {email} までご連絡ください。"],
      },
      {
        heading: "収集するデータ",
        paragraphs: ["当社は、お客様からご提供いただいたデータ、またはサイトの運営に必要なデータのみを取り扱います。"],
        list: [
          "お問い合わせフォーム：氏名、メールアドレス、会社名（任意）、関心のあるサービス、希望日時、お送りいただいたメッセージ。",
          "技術データ：フォームを不正利用から守り、サイトの安全性を保つために使用する IP アドレスおよびブラウザ情報。",
          "アクセス解析：お客様が同意した場合に限り、Google Analytics がサイトの利用状況（閲覧ページ、滞在時間、デバイスの種類、おおよその所在地）を収集します。",
        ],
      },
      {
        heading: "利用目的",
        list: [
          "お問い合わせへの回答およびコンサルティングの日程調整。",
          "お問い合わせを受け付けた旨の確認メールの送信。",
          "スパムや不正利用からサイトおよびフォームを保護すること。",
          "分析用 Cookie に同意いただいた場合に限り、サイトの利用状況を把握し改善すること。",
        ],
        after: ["お客様のデータを広告に利用したり、第三者に販売したりすることはありません。"],
      },
      {
        heading: "法的根拠",
        paragraphs: [
          "フォームのデータはお客様が開始したお問い合わせに対応するために、アクセス解析のデータはいつでも撤回可能なお客様の同意がある場合に限り取り扱います。サイトの保護は、サイトを安全に保つという当社の正当な利益に基づきます。",
        ],
      },
      {
        heading: "業務委託先",
        paragraphs: ["当社に代わり、各社のセキュリティ基準のもとでデータを取り扱う委託先とのみデータを共有します。"],
        list: [
          "Vercel：ウェブサイトのホスティング。",
          "Resend：フォームのメール送信。",
          "Cloudflare：DNS、セキュリティおよびボット検証（Turnstile）。",
          "Google Analytics：同意いただいた場合に限るサイト利用状況の計測。",
        ],
        after: ["一部の委託先はお客様の国外でデータを取り扱う場合があります。その場合、標準契約条項など適用法令に定める保護措置が適用されます。"],
      },
      {
        heading: "保存期間",
        paragraphs: [
          "各お問い合わせのデータは対応に必要な期間保存し、取引関係が始まった場合はその期間中および適用される法定期間保存します。取引関係がない場合は、最長 12 か月以内に削除します。アクセス解析データの保存期間は最長 14 か月です。",
        ],
      },
      {
        heading: "Cookie",
        paragraphs: [
          "本サイトは独自のトラッキング Cookie を使用しません。Google Analytics の Cookie は、Cookie に関するお知らせで同意いただいた場合にのみ設定されます。また、設定を記憶するため、Cookie の選択と使用言語がブラウザに保存されます。選択はフッターの「Cookie」リンクからいつでも変更できます。",
        ],
      },
      {
        heading: "お客様の権利",
        paragraphs: ["お客様はいつでも以下の権利を行使できます。"],
        list: ["データへのアクセス。", "不正確なデータの訂正。", "削除。", "取り扱いへの異議および制限。", "データポータビリティ。", "同意の撤回。"],
        after: ["権利の行使をご希望の場合は、{email} までご請求内容をお送りください。最長 20 営業日以内に回答いたします。また、お住まいの国のデータ保護当局に苦情を申し立てることもできます。"],
      },
      {
        heading: "セキュリティ",
        paragraphs: ["暗号化通信（HTTPS）、セキュリティヘッダー、フォームのボット対策、情報へのアクセス制限など、技術的・組織的な措置によりお客様のデータを保護しています。"],
      },
      {
        heading: "本ポリシーの変更",
        paragraphs: ["サイトや法令の変更を反映するため、本ポリシーを更新することがあります。変更内容は更新日とともにこのページに掲載します。"],
      },
    ],
  },
  zh: {
    title: "隐私政策",
    metaDescription: "NFory 如何处理访问 nfory.com 或与我们联系的用户的个人数据。",
    updated: "最后更新",
    back: "返回首页",
    intro: "NFory 尊重您的隐私。本政策说明当您访问 nfory.com 或与我们联系时，我们处理哪些个人数据、用于何种目的，以及您如何行使自己的权利。",
    sections: [
      {
        heading: "数据控制者",
        paragraphs: ["NFory 是您个人数据的控制者。如有任何与隐私相关的问题，请发送邮件至 {email}。"],
      },
      {
        heading: "我们收集的数据",
        paragraphs: ["我们仅处理您主动提供的数据或网站运行所必需的数据："],
        list: [
          "联系表单：姓名、电子邮箱、公司（选填）、感兴趣的服务、期望的日期和时段，以及您发送的留言。",
          "技术数据：IP 地址和浏览器信息，用于防止表单被滥用并保障网站安全。",
          "分析数据：仅在您同意后，Google Analytics 才会收集您使用网站的情况（访问的页面、访问时长、设备类型和大致位置）。",
        ],
      },
      {
        heading: "使用目的",
        list: ["回复您的咨询并安排咨询会议。", "向您发送已收到咨询的确认邮件。", "保护网站和表单免受垃圾信息及欺诈性使用。", "仅在您接受分析 Cookie 的情况下，了解网站的使用情况以加以改进。"],
        after: ["我们不会将您的数据用于广告，也不会出售给第三方。"],
      },
      {
        heading: "法律依据",
        paragraphs: ["我们处理表单数据是为了处理您发起的咨询；分析数据仅在您同意后处理，您可随时撤回同意。网站保护基于我们维护网站安全的合法利益。"],
      },
      {
        heading: "为我们提供服务的供应商",
        paragraphs: ["我们仅与代表我们处理数据、并具备自身安全保障的供应商共享数据："],
        list: ["Vercel：网站托管。", "Resend：发送表单邮件。", "Cloudflare：DNS、安全防护及人机验证（Turnstile）。", "Google Analytics：在您同意的前提下统计网站使用情况。"],
        after: ["部分供应商可能在您所在国家/地区以外处理数据；在此情况下，将适用相关法规规定的保障措施，例如标准合同条款。"],
      },
      {
        heading: "保存期限",
        paragraphs: ["我们会在处理每项咨询所需的期间内保存相关数据；如建立业务关系，则在关系存续期间及适用的法定期限内保存。如未建立业务关系，我们最迟将在 12 个月内删除数据。分析数据最长保存 14 个月。"],
      },
      {
        heading: "Cookie",
        paragraphs: ["本网站不使用自有的跟踪 Cookie。只有在您通过 Cookie 提示同意后，才会设置 Google Analytics Cookie。此外，您的浏览器会保存您的 Cookie 选择和首选语言，以便记住您的偏好。您可以随时通过页脚的“Cookie”链接更改选择。"],
      },
      {
        heading: "您的权利",
        paragraphs: ["您可随时行使以下权利："],
        list: ["访问您的数据。", "更正不准确的数据。", "删除数据。", "反对或限制处理。", "数据可携带。", "撤回同意。"],
        after: ["如需行使上述权利，请发送邮件至 {email} 说明您的请求；我们将在最多 20 个工作日内回复。您也可以向所在国家/地区的数据保护机构提出投诉。"],
      },
      {
        heading: "安全",
        paragraphs: ["我们采取技术和组织措施保护您的数据，包括加密连接（HTTPS）、安全响应头、表单人机验证以及严格的信息访问控制。"],
      },
      {
        heading: "政策变更",
        paragraphs: ["我们可能会更新本政策，以反映网站或法规的变化。任何变更都将连同更新日期发布在本页面。"],
      },
    ],
  },
  de: {
    title: "Datenschutzerklärung",
    metaDescription: "Wie NFory personenbezogene Daten von Besuchern von nfory.com und Interessenten verarbeitet.",
    updated: "Zuletzt aktualisiert",
    back: "Zur Startseite",
    intro:
      "Bei NFory respektieren wir Ihre Privatsphäre. Diese Erklärung beschreibt, welche personenbezogenen Daten wir verarbeiten, wenn Sie nfory.com besuchen oder uns schreiben, wofür wir sie verwenden und wie Sie Ihre Rechte ausüben können.",
    sections: [
      {
        heading: "Verantwortlicher",
        paragraphs: ["NFory ist für die Verarbeitung Ihrer personenbezogenen Daten verantwortlich. Bei Fragen zum Datenschutz erreichen Sie uns unter {email}."],
      },
      {
        heading: "Welche Daten wir erheben",
        paragraphs: ["Wir verarbeiten nur Daten, die Sie uns mitteilen oder die für den Betrieb der Website erforderlich sind:"],
        list: [
          "Kontaktformular: Name, E-Mail-Adresse, Unternehmen (optional), gewünschte Leistung, bevorzugtes Datum und Zeitfenster sowie Ihre Nachricht.",
          "Technische Daten: IP-Adresse und Browserdaten, um das Formular vor Missbrauch zu schützen und die Sicherheit der Website zu gewährleisten.",
          "Analyse: Nur mit Ihrer Einwilligung erfasst Google Analytics Informationen zur Nutzung der Website (besuchte Seiten, Besuchsdauer, Gerätetyp und ungefährer Standort).",
        ],
      },
      {
        heading: "Zwecke",
        list: [
          "Beantwortung Ihrer Anfrage und Terminvereinbarung für die Beratung.",
          "Versand einer Bestätigung, dass wir Ihre Anfrage erhalten haben.",
          "Schutz der Website und des Formulars vor Spam und Missbrauch.",
          "Verständnis der Nutzung der Website zu ihrer Verbesserung – nur, wenn Sie Analyse-Cookies akzeptieren.",
        ],
        after: ["Wir verwenden Ihre Daten nicht für Werbung und verkaufen sie nicht an Dritte."],
      },
      {
        heading: "Rechtsgrundlage",
        paragraphs: [
          "Formulardaten verarbeiten wir zur Bearbeitung der von Ihnen gestellten Anfrage (Art. 6 Abs. 1 lit. b DSGVO), Analysedaten ausschließlich mit Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die Sie jederzeit widerrufen können. Der Schutz der Website beruht auf unserem berechtigten Interesse an ihrer Sicherheit (Art. 6 Abs. 1 lit. f DSGVO).",
        ],
      },
      {
        heading: "Dienstleister",
        paragraphs: ["Wir geben Daten nur an Dienstleister weiter, die sie in unserem Auftrag und unter eigenen Sicherheitsgarantien verarbeiten:"],
        list: [
          "Vercel: Hosting der Website.",
          "Resend: Versand der Formular-E-Mails.",
          "Cloudflare: DNS, Sicherheit und Bot-Prüfung (Turnstile).",
          "Google Analytics: Messung der Website-Nutzung, nur mit Ihrer Einwilligung.",
        ],
        after: [
          "Einige dieser Dienstleister können Daten außerhalb Ihres Landes verarbeiten; in diesen Fällen gelten die gesetzlich vorgesehenen Garantien, etwa Standardvertragsklauseln.",
        ],
      },
      {
        heading: "Speicherdauer",
        paragraphs: [
          "Wir speichern die Daten jeder Anfrage so lange, wie es für ihre Bearbeitung erforderlich ist, und bei einer Geschäftsbeziehung für deren Dauer sowie die gesetzlichen Aufbewahrungsfristen. Ohne Geschäftsbeziehung löschen wir sie spätestens nach 12 Monaten. Analysedaten werden höchstens 14 Monate gespeichert.",
        ],
      },
      {
        heading: "Cookies",
        paragraphs: [
          "Diese Website verwendet keine eigenen Tracking-Cookies. Cookies von Google Analytics werden nur gesetzt, wenn Sie im Cookie-Hinweis zustimmen. Außerdem speichert Ihr Browser Ihre Cookie-Auswahl und Ihre bevorzugte Sprache, um Ihre Einstellungen zu behalten. Sie können Ihre Auswahl jederzeit über den Link „Cookies“ in der Fußzeile ändern.",
        ],
      },
      {
        heading: "Ihre Rechte",
        paragraphs: ["Sie haben jederzeit das Recht auf:"],
        list: [
          "Auskunft über Ihre Daten.",
          "Berichtigung unrichtiger Daten.",
          "Löschung.",
          "Widerspruch und Einschränkung der Verarbeitung.",
          "Datenübertragbarkeit.",
          "Widerruf Ihrer Einwilligung.",
        ],
        after: [
          "Schreiben Sie uns dazu an {email}; wir antworten innerhalb von höchstens 20 Werktagen. Sie können sich außerdem bei der Datenschutzaufsichtsbehörde Ihres Landes beschweren.",
        ],
      },
      {
        heading: "Sicherheit",
        paragraphs: [
          "Wir schützen Ihre Daten durch technische und organisatorische Maßnahmen: verschlüsselte Verbindungen (HTTPS), Sicherheits-Header, Bot-Schutz im Formular und eingeschränkten Zugriff auf Informationen.",
        ],
      },
      {
        heading: "Änderungen dieser Erklärung",
        paragraphs: ["Wir können diese Erklärung aktualisieren, um Änderungen der Website oder der Rechtslage zu berücksichtigen. Änderungen veröffentlichen wir auf dieser Seite mit dem jeweiligen Datum."],
      },
    ],
  },
  ru: {
    title: "Политика конфиденциальности",
    metaDescription: "Как NFory обрабатывает персональные данные посетителей nfory.com и тех, кто обращается к нам.",
    updated: "Последнее обновление",
    back: "На главную",
    intro:
      "NFory уважает вашу конфиденциальность. В этой политике описано, какие персональные данные мы обрабатываем, когда вы посещаете nfory.com или пишете нам, для чего мы их используем и как вы можете реализовать свои права.",
    sections: [
      {
        heading: "Оператор данных",
        paragraphs: ["NFory является оператором ваших персональных данных. По любым вопросам конфиденциальности пишите нам на {email}."],
      },
      {
        heading: "Какие данные мы собираем",
        paragraphs: ["Мы обрабатываем только данные, которые вы предоставляете сами, или которые необходимы для работы сайта:"],
        list: [
          "Форма обратной связи: имя, адрес электронной почты, компания (необязательно), интересующая услуга, предпочтительные дата и время, а также ваше сообщение.",
          "Технические данные: IP-адрес и данные браузера, используемые для защиты формы от злоупотреблений и обеспечения безопасности сайта.",
          "Аналитика: только с вашего согласия Google Analytics собирает сведения об использовании сайта (просмотренные страницы, длительность визита, тип устройства и приблизительное местоположение).",
        ],
      },
      {
        heading: "Цели обработки",
        list: [
          "Ответ на ваш запрос и согласование консультации.",
          "Отправка подтверждения о получении вашего запроса.",
          "Защита сайта и формы от спама и мошенничества.",
          "Понимание того, как используется сайт, для его улучшения — только если вы приняли аналитические cookie.",
        ],
        after: ["Мы не используем ваши данные для рекламы и не продаём их третьим лицам."],
      },
      {
        heading: "Правовые основания",
        paragraphs: [
          "Данные формы мы обрабатываем для выполнения инициированного вами запроса, а аналитические данные — только с вашего согласия, которое вы можете отозвать в любой момент. Защита сайта основана на нашем законном интересе в обеспечении его безопасности.",
        ],
      },
      {
        heading: "Поставщики услуг",
        paragraphs: ["Мы передаём данные только поставщикам, которые обрабатывают их по нашему поручению и с собственными гарантиями безопасности:"],
        list: [
          "Vercel: хостинг сайта.",
          "Resend: отправка писем из формы.",
          "Cloudflare: DNS, безопасность и проверка на ботов (Turnstile).",
          "Google Analytics: измерение использования сайта, только с вашего согласия.",
        ],
        after: [
          "Некоторые из этих поставщиков могут обрабатывать данные за пределами вашей страны; в таких случаях применяются гарантии, предусмотренные применимым законодательством, например стандартные договорные положения.",
        ],
      },
      {
        heading: "Срок хранения",
        paragraphs: [
          "Мы храним данные каждого запроса столько, сколько необходимо для его обработки, а при начале деловых отношений — в течение их срока и применимых законодательных сроков. Если деловые отношения не начаты, мы удаляем данные не позднее чем через 12 месяцев. Аналитические данные хранятся не более 14 месяцев.",
        ],
      },
      {
        heading: "Файлы cookie",
        paragraphs: [
          "Сайт не использует собственные отслеживающие cookie. Cookie Google Analytics устанавливаются только если вы принимаете их в уведомлении о cookie. Кроме того, ваш браузер сохраняет ваш выбор cookie и предпочитаемый язык, чтобы запомнить ваши настройки. Изменить выбор можно в любой момент по ссылке «Cookie» в нижней части страницы.",
        ],
      },
      {
        heading: "Ваши права",
        paragraphs: ["Вы в любой момент можете реализовать право на:"],
        list: [
          "Доступ к своим данным.",
          "Исправление неточных данных.",
          "Удаление.",
          "Возражение против обработки и её ограничение.",
          "Переносимость данных.",
          "Отзыв согласия.",
        ],
        after: [
          "Для этого напишите нам на {email}, указав ваш запрос; мы ответим не позднее чем через 20 рабочих дней. Вы также можете подать жалобу в орган по защите данных вашей страны.",
        ],
      },
      {
        heading: "Безопасность",
        paragraphs: [
          "Мы применяем технические и организационные меры для защиты ваших данных: шифрованное соединение (HTTPS), заголовки безопасности, защиту формы от ботов и ограниченный доступ к информации.",
        ],
      },
      {
        heading: "Изменения политики",
        paragraphs: ["Мы можем обновлять эту политику с учётом изменений сайта или законодательства. Все изменения публикуются на этой странице с датой обновления."],
      },
    ],
  },
};
