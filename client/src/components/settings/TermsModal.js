import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiChevronDown } from 'react-icons/fi';

const policies = {
  en: {
    termsOfService: {
      title: 'Terms of Service',
      sections: [
        {
          title: '1. Acceptance of Terms',
          content:
            'By creating an account or using TICOS, you agree to these Terms of Service, our Community Guidelines, Privacy Policy, and Anonymity Policy. If you do not agree, do not use the platform.',
        },
        {
          title: '2. Account Responsibility',
          content:
            'You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. You must provide accurate information and keep it updated.',
        },
        {
          title: '3. User Content',
          content:
            'You retain ownership of content you post. By posting, you grant TICOS a non-exclusive, royalty-free license to display and distribute your content on the platform. You represent that you have the rights to any content you share.',
        },
        {
          title: '4. Acceptable Use',
          content:
            'You agree not to use TICOS for any illegal activity, to harass others, to distribute malware, to impersonate others for harmful purposes, or to violate any applicable laws. We encourage free expression within legal boundaries.',
        },
        {
          title: '5. Third-Party Links',
          content:
            'TICOS may contain links to third-party websites. We are not responsible for the content or practices of third-party services.',
        },
        {
          title: '6. Termination',
          content:
            'We reserve the right to suspend or terminate accounts that violate these terms, engage in illegal activity, or abuse the platform. You may delete your account at any time.',
        },
        {
          title: '7. Disclaimer of Warranties',
          content:
            'TICOS is provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free service.',
        },
        {
          title: '8. Limitation of Liability',
          content:
            'TICOS shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.',
        },
        {
          title: '9. Changes to Terms',
          content:
            'We may update these terms at any time. Continued use after changes constitutes acceptance of the new terms.',
        },
        {
          title: '10. Governing Law',
          content:
            'These terms are governed by applicable laws. Any disputes shall be resolved in the appropriate jurisdiction.',
        },
      ],
    },
    communityGuidelines: {
      title: 'Community Guidelines',
      sections: [
        {
          title: 'Our Philosophy',
          content:
            'TICOS is a platform for free expression. We believe in maximum possible anonymity and freedom of speech within legal and safety limits. Our moderation focuses on legality and safety, not ideological censorship.',
        },
        {
          title: 'Allowed Content',
          content:
            'We encourage diverse expression including controversial opinions, political discussion, humor, memes, criticism, and edgy content. Anonymous expression is protected. Legal adult discussions are permitted.',
        },
        {
          title: 'Prohibited Content',
          content:
            'The following are strictly prohibited: doxxing (sharing private information), threats of violence, child sexual exploitation material, illegal pornography, revenge porn, terrorism coordination, fraud, malware distribution, impersonation for harm, targeted harassment, illegal sales, and explicit criminal coordination.',
        },
        {
          title: 'Good Faith Participation',
          content:
            'While we allow strong opinions, we ask users to participate in good faith. Targeted harassment campaigns, coordinated abuse, and platform manipulation are not allowed.',
        },
        {
          title: 'Reporting Violations',
          content:
            'If you see content that violates these guidelines, please report it. We review reports and take appropriate action.',
        },
      ],
    },
    privacyPolicy: {
      title: 'Privacy Policy',
      sections: [
        {
          title: 'Information We Collect',
          content:
            'We collect information you provide: name, email, username, profile picture, bio, and content you post. We also collect technical data: IP addresses, browser type, device information, and usage patterns.',
        },
        {
          title: 'How We Use Information',
          content:
            'We use your information to provide and improve our services, moderate content, prevent abuse, comply with legal obligations, and communicate with you about the platform.',
        },
        {
          title: 'Data Retention',
          content:
            'We retain your information while your account is active. Logs and technical data may be retained temporarily for security and abuse prevention. Deleted content may persist in backups for a reasonable period.',
        },
        {
          title: 'Data Sharing',
          content:
            'We do not sell your personal information. We may share data with law enforcement when required by law, with service providers who help operate the platform, or with your consent.',
        },
        {
          title: 'Your Rights',
          content:
            'You may access, update, or delete your account information at any time. You can download your data upon request. You may request information about what data we hold.',
        },
        {
          title: 'Cookies',
          content:
            'We use essential cookies for authentication and platform functionality. Analytics cookies help us understand usage patterns.',
        },
      ],
    },
    anonymityPolicy: {
      title: 'Anonymity Policy',
      sections: [
        {
          title: 'Public Anonymity',
          content:
            'TICOS offers anonymous posting. When you post anonymously, your identity is not shown to the public. Your username, avatar, and profile information are not displayed with anonymous content. Anonymous posts cannot be publicly linked to each other or to your account.',
        },
        {
          title: 'Limitations of Anonymity',
          content:
            'Anonymity is public-facing only. TICOS may privately retain limited technical information (such as IP addresses, session data, and account metadata) for security, abuse prevention, moderation, and legal compliance purposes.',
        },
        {
          title: 'Legal Compliance',
          content:
            'Anonymity is not absolute. TICOS will comply with lawful requests from law enforcement and regulatory authorities. In cases involving illegal activity, threats, or harm, we may disclose information as required by law.',
        },
        {
          title: 'No Absolute Guarantees',
          content:
            'We do not and cannot promise absolute anonymity, zero logging, immunity from law enforcement, or untraceability. Users should not engage in illegal activity under the assumption of complete anonymity.',
        },
        {
          title: 'User Responsibility',
          content:
            'Users are responsible for what they post, including anonymous content. Anonymity does not exempt users from these policies or applicable laws.',
        },
        {
          title: 'Anonymous Mode Persistence',
          content:
            'Anonymous mode, once activated, is permanently tied to your account. It cannot be accidentally disabled. Deactivation requires explicit confirmation through a security prompt. This ensures your anonymity preference is protected against accidental changes.',
        },
      ],
    },
    malwareDisclaimer: {
      title: 'Malware Analysis Disclaimer & Upload Security',
      sections: [
        {
          title: 'Purpose of File Sharing',
          content:
            'Any potentially dangerous or executable code shared on TICOS must be shared strictly for educational, analysis, compatibility, or defensive research purposes only. Sharing code with the intent to harm, compromise, or damage systems is strictly prohibited.',
        },
        {
          title: 'Authorization Requirement',
          content:
            'Deployment of any shared code, scripts, or executables against systems without explicit prior authorization is prohibited. You are solely responsible for ensuring you have proper authorization before deploying or executing any code obtained through the platform.',
        },
        {
          title: 'Prohibited File Types',
          content:
            'Uploading executable files (.exe, .bat, .cmd, .com, .msi, .scr, .ps1, .vbs, .jar, .dll, .app, .bin, .sh), installers, or any files containing active code or macros is strictly prohibited unless explicitly authorized for security research purposes.',
        },
        {
          title: 'Security Measures',
          content:
            'All uploaded files are subject to automated security analysis including: cryptographic hash computation (SHA-256), file signature analysis, metadata extraction, and comparison against known malware databases and threat intelligence feeds. Suspicious files may be sandboxed for behavioral analysis.',
        },
        {
          title: 'Hash Storage & Reputation',
          content:
            'Cryptographic hashes of all uploaded files are stored and may be shared with security partners and threat intelligence platforms. Files may be checked against known malware hash databases. Uploading files with known malicious hashes will result in automatic rejection and account review.',
        },
        {
          title: 'Manual Moderation',
          content:
            'Uploaded content may be subject to manual review by moderators. Files that are flagged by automated systems or reported by users will be reviewed. Accounts associated with malicious uploads will be suspended and may be reported to relevant authorities.',
        },
        {
          title: 'No Liability',
          content:
            'TICOS provides no warranty regarding the safety of user-uploaded files. All files are uploaded at your own risk. The platform is not liable for any damage caused by content uploaded by users. You assume full responsibility for files you download and execute.',
        },
      ],
    },
  },
  es: {
    termsOfService: {
      title: 'Términos de Servicio',
      sections: [
        {
          title: '1. Aceptación de Términos',
          content:
            'Al crear una cuenta o usar TICOS, aceptas estos Términos de Servicio, nuestras Normas Comunitarias, Política de Privacidad y Política de Anonimato. Si no estás de acuerdo, no uses la plataforma.',
        },
        {
          title: '2. Responsabilidad de la Cuenta',
          content:
            'Eres responsable de mantener la confidencialidad de tus credenciales y de toda actividad en tu cuenta. Debes proporcionar información precisa y mantenerla actualizada.',
        },
        {
          title: '3. Contenido del Usuario',
          content:
            'Conservas la propiedad del contenido que publicas. Al publicar, otorgas a TICOS una licencia no exclusiva y libre de regalías para mostrar y distribuir tu contenido en la plataforma. Declaras tener los derechos sobre cualquier contenido que compartas.',
        },
        {
          title: '4. Uso Aceptable',
          content:
            'Aceptas no usar TICOS para actividades ilegales, acosar a otros, distribuir malware, suplantar a otros con fines dañinos, o violar leyes aplicables. Fomentamos la libre expresión dentro de los límites legales.',
        },
        {
          title: '5. Enlaces de Terceros',
          content:
            'TICOS puede contener enlaces a sitios web de terceros. No somos responsables del contenido o prácticas de servicios de terceros.',
        },
        {
          title: '6. Terminación',
          content:
            'Nos reservamos el derecho de suspender o terminar cuentas que violen estos términos, participen en actividades ilegales, o abusen de la plataforma. Puedes eliminar tu cuenta en cualquier momento.',
        },
        {
          title: '7. Exención de Garantías',
          content:
            'TICOS se proporciona "tal cual" sin garantías de ningún tipo. No garantizamos un servicio ininterrumpido o libre de errores.',
        },
        {
          title: '8. Limitación de Responsabilidad',
          content:
            'TICOS no será responsable por daños indirectos, incidentales o consecuentes derivados del uso de la plataforma.',
        },
        {
          title: '9. Cambios a los Términos',
          content:
            'Podemos actualizar estos términos en cualquier momento. El uso continuado después de los cambios constituye la aceptación de los nuevos términos.',
        },
        {
          title: '10. Ley Aplicable',
          content:
            'Estos términos se rigen por las leyes aplicables. Cualquier disputa se resolverá en la jurisdicción correspondiente.',
        },
      ],
    },
    communityGuidelines: {
      title: 'Normas de la Comunidad',
      sections: [
        {
          title: 'Nuestra Filosofía',
          content:
            'TICOS es una plataforma para la libre expresión. Creemos en el máximo anonimato posible y libertad de expresión dentro de los límites legales y de seguridad. Nuestra moderación se enfoca en legalidad y seguridad, no en censura ideológica.',
        },
        {
          title: 'Contenido Permitido',
          content:
            'Fomentamos la expresión diversa incluyendo opiniones controversiales, discusión política, humor, memes, crítica y contenido provocador. La expresión anónima está protegida. Se permiten discusiones legales para adultos.',
        },
        {
          title: 'Contenido Prohibido',
          content:
            'Lo siguiente está estrictamente prohibido: doxxing (compartir información privada), amenazas de violencia, material de explotación infantil, pornografía ilegal, venganza pornográfica, coordinación terrorista, fraude, distribución de malware, suplantación para dañar, acoso dirigido, ventas ilegales y coordinación criminal explícita.',
        },
        {
          title: 'Participación de Buena Fe',
          content:
            'Aunque permitimos opiniones fuertes, pedimos a los usuarios participar de buena fe. Las campañas de acoso dirigido, abuso coordinado y manipulación de la plataforma no están permitidas.',
        },
        {
          title: 'Reportar Violaciones',
          content:
            'Si ves contenido que viola estas normas, repórtalo. Revisamos los reportes y tomamos las acciones apropiadas.',
        },
      ],
    },
    privacyPolicy: {
      title: 'Política de Privacidad',
      sections: [
        {
          title: 'Información que Recopilamos',
          content:
            'Recopilamos información que proporcionas: nombre, email, usuario, foto de perfil, biografía y contenido que publicas. También recopilamos datos técnicos: direcciones IP, tipo de navegador, información del dispositivo y patrones de uso.',
        },
        {
          title: 'Cómo Usamos la Información',
          content:
            'Usamos tu información para proporcionar y mejorar nuestros servicios, moderar contenido, prevenir abusos, cumplir obligaciones legales y comunicarnos contigo sobre la plataforma.',
        },
        {
          title: 'Retención de Datos',
          content:
            'Conservamos tu información mientras tu cuenta esté activa. Los registros y datos técnicos pueden retenerse temporalmente por seguridad y prevención de abusos. El contenido eliminado puede persistir en copias de seguridad por un período razonable.',
        },
        {
          title: 'Compartir Datos',
          content:
            'No vendemos tu información personal. Podemos compartir datos con autoridades cuando sea requerido por ley, con proveedores que ayudan a operar la plataforma, o con tu consentimiento.',
        },
        {
          title: 'Tus Derechos',
          content:
            'Puedes acceder, actualizar o eliminar la información de tu cuenta en cualquier momento. Puedes descargar tus datos si lo solicitas. Puedes solicitar información sobre qué datos tenemos.',
        },
        {
          title: 'Cookies',
          content:
            'Usamos cookies esenciales para autenticación y funcionalidad de la plataforma. Las cookies analíticas nos ayudan a entender patrones de uso.',
        },
      ],
    },
    anonymityPolicy: {
      title: 'Política de Anonimato',
      sections: [
        {
          title: 'Anonimato Público',
          content:
            'TICOS ofrece publicación anónima. Cuando publicas anónimamente, tu identidad no se muestra al público. Tu nombre de usuario, avatar e información de perfil no se muestran con el contenido anónimo. Las publicaciones anónimas no pueden vincularse públicamente entre sí ni a tu cuenta.',
        },
        {
          title: 'Limitaciones del Anonimato',
          content:
            'El anonimato es solo hacia el público. TICOS puede retener privadamente información técnica limitada (como direcciones IP, datos de sesión y metadatos de cuenta) por seguridad, prevención de abusos, moderación y cumplimiento legal.',
        },
        {
          title: 'Cumplimiento Legal',
          content:
            'El anonimato no es absoluto. TICOS cumplirá con solicitudes legales de autoridades. En casos de actividad ilegal, amenazas o daño, podemos divulgar información según lo requiera la ley.',
        },
        {
          title: 'Sin Garantías Absolutas',
          content:
            'No podemos prometer anonimato absoluto, cero registros, inmunidad de las autoridades o imposibilidad de rastreo. Los usuarios no deben participar en actividades ilegales bajo la suposición de anonimato completo.',
        },
        {
          title: 'Responsabilidad del Usuario',
          content:
            'Los usuarios son responsables de lo que publican, incluyendo contenido anónimo. El anonimato no exime a los usuarios de estas políticas o leyes aplicables.',
        },
        {
          title: 'Persistencia del Modo Anónimo',
          content:
            'El modo anónimo, una vez activado, queda permanentemente vinculado a tu cuenta. No puede ser desactivado accidentalmente. La desactivación requiere confirmación explícita a través de un mensaje de seguridad. Esto asegura que tu preferencia de anonimato esté protegida contra cambios accidentales.',
        },
      ],
    },
    malwareDisclaimer: {
      title: 'Descargo de Responsabilidad de Análisis de Malware y Seguridad de Archivos',
      sections: [
        {
          title: 'Propósito del Intercambio de Archivos',
          content:
            'Cualquier código potencialmente peligroso o ejecutable compartido en TICOS debe compartirse estrictamente solo con fines educativos, de análisis, compatibilidad o investigación defensiva. Compartir código con la intención de dañar, comprometer o perjudicar sistemas está estrictamente prohibido.',
        },
        {
          title: 'Requisito de Autorización',
          content:
            'La implementación de cualquier código, script o ejecutable compartido contra sistemas sin autorización previa explícita está prohibida. Eres el único responsable de asegurarte de tener la autorización adecuada antes de implementar o ejecutar cualquier código obtenido a través de la plataforma.',
        },
        {
          title: 'Tipos de Archivos Prohibidos',
          content:
            'La subida de archivos ejecutables (.exe, .bat, .cmd, .com, .msi, .scr, .ps1, .vbs, .jar, .dll, .app, .bin, .sh), instaladores o cualquier archivo que contenga código activo o macros está estrictamente prohibida a menos que esté explícitamente autorizada para fines de investigación de seguridad.',
        },
        {
          title: 'Medidas de Seguridad',
          content:
            'Todos los archivos subidos están sujetos a análisis de seguridad automatizado que incluye: cálculo de hash criptográfico (SHA-256), análisis de firma de archivos, extracción de metadatos y comparación con bases de datos de malware conocidas y fuentes de inteligencia de amenazas. Los archivos sospechosos pueden ser puestos en sandbox para análisis de comportamiento.',
        },
        {
          title: 'Almacenamiento de Hash y Reputación',
          content:
            'Los hashes criptográficos de todos los archivos subidos se almacenan y pueden compartirse con socios de seguridad y plataformas de inteligencia de amenazas. Los archivos pueden verificarse contra bases de datos de hashes de malware conocidos. La subida de archivos con hashes maliciosos conocidos resultará en el rechazo automático y revisión de la cuenta.',
        },
        {
          title: 'Moderación Manual',
          content:
            'El contenido subido puede estar sujeto a revisión manual por moderadores. Los archivos marcados por sistemas automatizados o reportados por usuarios serán revisados. Las cuentas asociadas con subidas maliciosas serán suspendidas y pueden ser reportadas a las autoridades correspondientes.',
        },
        {
          title: 'Sin Responsabilidad',
          content:
            'TICOS no ofrece garantía sobre la seguridad de los archivos subidos por usuarios. Todos los archivos se suben bajo tu propio riesgo. La plataforma no es responsable por daños causados por contenido subido por usuarios. Asumes toda responsabilidad por los archivos que descargues y ejecutes.',
        },
      ],
    },
  },
};

const PolicyViewer = ({ policyKey, lang, onBack }) => {
  const policy = policies[lang]?.[policyKey] || policies.en[policyKey];
  if (!policy) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6"
    >
      <button
        onClick={onBack}
        className="text-sm text-ticos-accent dark:text-ticos-accent hover:underline mb-4"
      >
        &larr; {lang === 'es' ? 'Volver' : 'Back'}
      </button>
      <h3 className="text-xl font-bold mb-4">{policy.title}</h3>
      <div className="space-y-4">
        {policy.sections.map((section, i) => (
          <div key={i}>
            <h4 className="font-semibold text-sm text-ticos-primary dark:text-ticos-dark-primary mb-1">{section.title}</h4>
            <p className="text-sm text-ticos-secondary dark:text-ticos-dark-secondary leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const TermsModal = ({ isOpen, onClose, onAccept, lang = 'en' }) => {
  const [view, setView] = useState(null);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');

  const t = (key) => {
    const keys = key.split('.');
    let value = policies[lang];
    for (const k of keys) {
      if (value === undefined) return key;
      value = value[k];
    }
    return value?.title || key;
  };

  const handleAccept = () => {
    if (!accepted) {
      setError(lang === 'es' ? 'Debes aceptar los términos para continuar' : 'You must accept the terms to continue');
      return;
    }
    onAccept();
  };

  const policyList = [
    { key: 'termsOfService', title: lang === 'es' ? 'Términos de Servicio' : 'Terms of Service' },
    { key: 'communityGuidelines', title: lang === 'es' ? 'Normas de la Comunidad' : 'Community Guidelines' },
    { key: 'privacyPolicy', title: lang === 'es' ? 'Política de Privacidad' : 'Privacy Policy' },
    { key: 'anonymityPolicy', title: lang === 'es' ? 'Política de Anonimato' : 'Anonymity Policy' },
    { key: 'malwareDisclaimer', title: lang === 'es' ? 'Seguridad de Archivos y Malware' : 'File Security & Malware Policy' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-ticos-dark-card rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-ticos-dark-border">
              <h2 className="text-lg font-bold">
                {view
                  ? ''
                  : lang === 'es'
                  ? 'Términos y Políticas'
                  : 'Terms & Policies'}
              </h2>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-ticos-dark-hover rounded-full transition">
                <FiX size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {view ? (
                <PolicyViewer
                  policyKey={view}
                  lang={lang}
                  onBack={() => setView(null)}
                />
              ) : (
                <div className="p-6 space-y-3">
                  <p className="text-sm text-ticos-secondary dark:text-ticos-dark-secondary mb-4">
                    {lang === 'es'
                      ? 'Para activar el Modo Anónimo, lee y acepta nuestras políticas:'
                      : 'To enable Anonymous Mode, please read and accept our policies:'}
                  </p>
                  {policyList.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setView(item.key)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-ticos-dark-hover hover:bg-gray-100 dark:hover:bg-ticos-dark-hover rounded-xl transition-colors text-left"
                    >
                      <span className="font-medium text-sm">{item.title}</span>
                      <FiChevronDown
                        size={16}
                        className="text-ticos-secondary dark:text-ticos-dark-secondary -rotate-90"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {!view && (
              <div className="border-t border-gray-100 dark:border-ticos-dark-border p-4 space-y-3">
                {error && (
                  <p className="text-xs text-ticos-like-red">{error}</p>
                )}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => {
                      setAccepted(e.target.checked);
                      setError('');
                    }}
                    className="w-4 h-4 mt-0.5 rounded border-gray-300 dark:border-gray-600 text-ticos-accent focus:ring-ticos-accent cursor-pointer"
                  />
                  <span className="text-sm text-ticos-secondary dark:text-ticos-dark-secondary">
                    {lang === 'es'
                      ? 'He leído y acepto los Términos de Servicio, Normas de la Comunidad, Política de Privacidad, Política de Anonimato y la Política de Seguridad de Archivos'
                      : 'I have read and agree to the Terms of Service, Community Guidelines, Privacy Policy, Anonymity Policy, and File Security Policy'}
                  </span>
                </label>
                <button
                  onClick={handleAccept}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-sm hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
                >
                  <FiCheck size={18} />
                  {lang === 'es' ? 'Aceptar y Activar' : 'Accept & Enable'}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TermsModal;
