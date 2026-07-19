import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

export default function ContactPage() {
  return (
    <section className="pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-ochre font-semibold text-sm uppercase tracking-widest mb-2">Get in Touch</p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl" style={{ color: 'var(--text-primary)' }}>
            Contact RRR Foods
          </h1>
          <p className="mt-4 text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
            We are here to help with product queries, order updates, and partnership discussions.
          </p>
        </div>

        <div className="card p-6 sm:p-8 space-y-6">
          <a
            id="contact-page-phone-link"
            href="tel:9704371867"
            className="flex items-start gap-4 hover:text-ochre transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <span className="p-3 rounded-xl glass">
              <FiPhone size={18} />
            </span>
            <span>
              <p className="text-xs uppercase tracking-wider mb-1">Phone</p>
              <p className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>9704371867</p>
            </span>
          </a>

          <a
            id="contact-page-email-link"
            href="mailto:support@rexplore.tech"
            className="flex items-start gap-4 hover:text-ochre transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <span className="p-3 rounded-xl glass">
              <FiMail size={18} />
            </span>
            <span>
              <p className="text-xs uppercase tracking-wider mb-1">Email</p>
              <p className="text-base font-medium break-all" style={{ color: 'var(--text-primary)' }}>
                support@rexplore.tech
              </p>
            </span>
          </a>

          <div className="flex items-start gap-4" style={{ color: 'var(--text-secondary)' }}>
            <span className="p-3 rounded-xl glass">
              <FiMapPin size={18} />
            </span>
            <span>
              <p className="text-xs uppercase tracking-wider mb-1">Support Partner</p>
              <p className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>
                Rexplore Technologies
              </p>
              <a
                href="https://rexplore.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ochre hover:underline"
              >
                https://rexplore.tech
              </a>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
