import { Globe, Linkedin, Facebook, Instagram, Twitter } from 'lucide-react';

const SocialNetworking = ({ formData, setFormData }) => {
  const socialLinks = [
    {
      key: 'website',
      label: 'Website',
      placeholder: 'https://www.yourcompany.com',
      icon: Globe,
    },
    {
      key: 'linkedin',
      label: 'LinkedIn Page',
      placeholder: 'https://linkedin.com/company/yourcompany',
      icon: Linkedin,
    },
    {
      key: 'facebook',
      label: 'Facebook',
      placeholder: 'https://facebook.com/yourcompany',
      icon: Facebook,
    },
    {
      key: 'instagram',
      label: 'Instagram',
      placeholder: 'https://instagram.com/yourcompany',
      icon: Instagram,
    },
    {
      key: 'twitter',
      label: 'Twitter',
      placeholder: 'https://twitter.com/yourcompany',
      icon: Twitter,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-4">
        <p className="text-xs sm:text-sm text-teal-800">
          ℹ️ Add your social media profiles to help others connect with you (Optional)
        </p>
      </div>

      {socialLinks.map((link) => {
        const Icon = link.icon;
        return (
          <div key={link.key}>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              {link.label}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={formData[link.key]}
                onChange={(e) => setFormData({ ...formData, [link.key]: e.target.value })}
                onBlur={(e) => {
                  let val = e.target.value.trim();
                  if (val && !/^https?:\/\//i.test(val)) {
                    setFormData({ ...formData, [link.key]: `https://${val}` });
                  }
                }}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder={link.placeholder}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SocialNetworking;
