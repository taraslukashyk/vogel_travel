import React, { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Save, AlertCircle, CheckCircle2, Phone, Mail, MapPin, Instagram, Facebook, Send, MessageCircle, Bot } from 'lucide-react';
import { getSettings, updateSettings } from '../../lib/queries/settings';
import type { SiteSettings } from '../../lib/queries/settings';


export default function Settings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getSettings(true);

      if (data) {
        setSettings(data);
      } else {
        // Fallback default values if no data exists yet
        setSettings({
          id: 1,
          phone_primary: '+38 050 469 2882',
          phone_secondary: '+38 044 469 2882',
          email: 'booking@vogel.travel',
          address: 'Спортивна площа, 1А, Київ',
          instagram_url: 'https://www.instagram.com/vogel.family.travel/',
          facebook_url: 'https://www.facebook.com/vogelfamilytravel/',
          telegram_url: 'https://t.me/Taras_luka',
          whatsapp_url: 'https://wa.me/380685032230',
          telegram_bot_token: '',
          telegram_chat_id: '',
        });
      }
    } catch (err) {
      console.error(err);
      setError('Не вдалося завантажити налаштування');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updateSettings(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Помилка при збереженні');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => prev ? { ...prev, [name]: value } : null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <SettingsIcon className="text-teal-600" />
            Загальні налаштування сайту
          </h1>
          <p className="text-gray-500 mt-1">Керування контактними даними та посиланнями на соцмережі</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Information */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Phone size={20} className="text-teal-600" />
              Контактна інформація
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Основний телефон</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  name="phone_primary"
                  value={settings?.phone_primary || ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  placeholder="+38 0XX XXX XXXX"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Додатковий телефон</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  name="phone_secondary"
                  value={settings?.phone_secondary || ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  placeholder="+38 0XX XXX XXXX"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email адреса</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  name="email"
                  value={settings?.email || ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  placeholder="mail@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Адреса офісу</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  name="address"
                  value={settings?.address || ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  placeholder="Вулиця, буд., місто"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Instagram size={20} className="text-teal-600" />
              Соціальні мережі
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  name="instagram_url"
                  value={settings?.instagram_url || ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
              <div className="relative">
                <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  name="facebook_url"
                  value={settings?.facebook_url || ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  placeholder="https://facebook.com/..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telegram URL (аккаунт менеджера)</label>
              <div className="relative">
                <Send className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  name="telegram_url"
                  value={settings?.telegram_url || ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  placeholder="https://t.me/..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp URL</label>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  name="whatsapp_url"
                  value={settings?.whatsapp_url || ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  placeholder="https://wa.me/..."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Telegram Bot Notifications */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Bot size={20} className="text-teal-600" />
              Налаштування Telegram Бота для сповіщень
            </h2>
            <p className="text-sm text-gray-500 mt-1">Ці дані використовуються для автоматичного надсилання нових заявок з сайту у ваш Telegram чат чи групу.</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telegram Bot Token</label>
              <input
                type="password"
                name="telegram_bot_token"
                value={settings?.telegram_bot_token || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-gray-50/30"
                placeholder="Вставте токен від @BotFather"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chat ID</label>
              <input
                type="text"
                name="telegram_chat_id"
                value={settings?.telegram_chat_id || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all bg-gray-50/30"
                placeholder="ID вашого чату (напр. 123456789)"
              />
            </div>
          </div>
        </section>

        <div className="flex items-center gap-4 sticky bottom-6 bg-white/80 backdrop-blur-md p-4 rounded-xl border border-gray-200 shadow-lg z-10 transition-all">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-all disabled:opacity-50 min-w-[200px]"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Зберегти налаштування
          </button>

          {success && (
            <div className="flex items-center gap-2 text-green-600 font-medium animate-in fade-in slide-in-from-left-4">
              <CheckCircle2 size={18} />
              Налаштування успішно збережено!
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600 font-medium animate-in fade-in slide-in-from-left-4">
              <AlertCircle size={18} />
              {error}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
