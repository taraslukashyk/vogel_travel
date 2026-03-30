import { useState, useEffect, useCallback } from 'react';
import {
  BarChart2,
  Users,
  Eye,
  MousePointerClick,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ExternalLink,
  AlertCircle,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

// --- Types ---
interface KPIs {
  sessions: number;
  users: number;
  pageViews: number;
  engagementRate: number;
  avgSessionDuration: number;
}

interface DailyDynamics {
  date: string;
  sessions: number;
}

interface ChannelRow {
  name: string;
  sessions: number;
  pct: number;
}

interface CountryRow {
  name: string;
  sessions: number;
  pct: number;
}

interface DeviceRow {
  name: string;
  sessions: number;
  pct: number;
}

interface CityRow {
  name: string;
  sessions: number;
  pct: number;
}

interface EventRow {
  name: string;
  count: number;
}

interface AnalyticsData {
  configured: boolean;
  error?: string;
  kpis?: KPIs;
  dailyDynamics?: DailyDynamics[];
  channels?: ChannelRow[];
  countries?: CountryRow[];
  cities?: CityRow[];
  devices?: DeviceRow[];
  events?: EventRow[];
}

// --- Helpers ---
function formatNum(n: number): string {
  return n.toLocaleString('uk-UA');
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  if (m === 0) return `${s}с`;
  return `${m}хв ${s}с`;
}

function formatPct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

const CHANNEL_LABELS: Record<string, { label: string; desc: string }> = {
  'Organic Search': { label: 'Органічний пошук', desc: 'Переходи з пошукових систем (Google, Bing)' },
  'Direct': { label: 'Прямий', desc: 'Прямий набір URL або збережені закладки' },
  'Organic Social': { label: 'Соцмережі', desc: 'Природні переходи з Instagram, Facebook тощо' },
  'Referral': { label: 'Реферальний', desc: 'Переходи за посиланнями на інших сайтах' },
  'Email': { label: 'Email', desc: 'Переходи з електронних листів та розсилок' },
  'Paid Search': { label: 'Платний пошук', desc: 'Заходи через платну контекстну рекламу' },
  'Display': { label: 'Медійний', desc: 'Переходи з банерної реклами' },
  'Affiliates': { label: 'Партнери', desc: 'Трафік через партнерські мережі' },
  'Unassigned': { label: 'Невизначено', desc: 'Джерело не вдалося розпізнати або приховано' },
};

const DEVICE_LABELS: Record<string, { label: string; Icon: React.ElementType }> = {
  mobile: { label: 'Мобільні', Icon: Smartphone },
  desktop: { label: 'Десктоп', Icon: Monitor },
  tablet: { label: 'Планшети', Icon: Tablet },
};

const EVENT_LABELS: Record<string, { label: string; desc: string }> = {
  'page_view': { label: 'Перегляд сторінки', desc: 'Завантаження або оновлення сторінки' },
  'user_engagement': { label: 'Залученість', desc: 'Активний перегляд (понад 10 секунд)' },
  'scroll': { label: 'Прокрутка', desc: 'Користувач досяг низу сторінки (90%)' },
  'session_start': { label: 'Нова сесія', desc: 'Початок нового сеансу взаємодії' },
  'first_visit': { label: 'Перший візит', desc: 'Користувач на сайті вперше' },
  'form_start': { label: 'Взаємодія з формою', desc: 'Початок введення даних у форму' },
  'form_submit': { label: 'Відправка форми', desc: 'Успішне відправлення форми заявок' },
  'click': { label: 'Клік по посиланню', desc: 'Перехід за зовнішнім посиланням' },
  'file_download': { label: 'Завантаження файлу', desc: 'Завантаження документа з сайту' },
  'video_start': { label: 'Перегляд відео', desc: 'Запуск фонового відео' },
};

const DAYS_OPTIONS = [
  { value: 7, label: '7 днів' },
  { value: 30, label: '30 днів' },
  { value: 90, label: '90 днів' },
];

// --- Skeleton ---
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className ?? ''}`} />;
}

function KpiSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

function BlockSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-3">
      <Skeleton className="h-5 w-40 mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  );
}

// --- Setup Instructions ---
function SetupInstructions() {
  return (
    <div className="bg-white rounded-xl border border-amber-200 shadow-sm p-6 max-w-2xl">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
          <AlertCircle size={20} className="text-amber-500" />
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Потрібне налаштування GA4</h3>
            <p className="text-sm text-gray-500 mt-1">
              Для відображення даних необхідно підключити Google Analytics 4 через сервісний акаунт.
            </p>
          </div>

          <ol className="space-y-3 text-sm text-gray-700">
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">1</span>
              <span>
                <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" className="text-teal-600 underline">Google Cloud Console</a>
                {' '}→ APIs & Services → увімкнути <strong>Google Analytics Data API</strong>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">2</span>
              <span>IAM & Admin → Service Accounts → обрати або створити акаунт → <strong>Keys → Add Key → JSON</strong> → завантажити файл</span>
            </li>
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">3</span>
              <span>
                <a href="https://analytics.google.com" target="_blank" rel="noreferrer" className="text-teal-600 underline">Google Analytics</a>
                {' '}→ Admin → Property Access Management → додати email сервісного акаунту як <strong>Viewer</strong>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">4</span>
              <span>GA4 Admin → Property Settings → скопіювати числовий <strong>Property ID</strong> (не G-xxx)</span>
            </li>
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">5</span>
              <span>
                <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-teal-600 underline">Supabase Dashboard</a>
                {' '}→ Settings → Edge Functions → Secrets → додати:
                <br />
                <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded mt-1 inline-block">GA4_PROPERTY_ID</code> та
                <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded mt-1 inline-block ml-1">GA4_SERVICE_ACCOUNT_KEY</code>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">6</span>
              <span>Запустити у терміналі: <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">supabase functions deploy ga4-analytics</code></span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---
export default function Analytics() {
  const [days, setDays] = useState<7 | 30 | 90>(30);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('ga4-analytics', {
        body: { days },
      });
      if (error) throw error;
      setData(result as AnalyticsData);
    } catch (err: any) {
      console.error('Analytics fetch error:', err);
      setData({
        configured: true,
        error: err.message || 'Не вдалося завантажити дані. Перевірте консоль (F12) або налаштування секретів.'
      });
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isConfigured = data?.configured !== false;
  const hasError = isConfigured && !!data?.error;
  const hasData = isConfigured && !hasError && !!data?.kpis;
  const maxSessions = data?.dailyDynamics ? Math.max(...data.dailyDynamics.map(d => d.sessions)) : 0;

  return (
    <div className="space-y-6 pb-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Аналітика</h1>
          <p className="text-sm text-gray-500 mt-1 max-w-lg leading-relaxed">
            Тут зібрано лише основні показники. Повна статистика доступна у вашому кабінеті Google Analytics.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Period switcher */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
            {DAYS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setDays(opt.value as 7 | 30 | 90)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${days === opt.value
                    ? 'bg-white text-teal-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors disabled:opacity-40"
            title="Оновити"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          {/* External link to GA4 */}
          <a
            href="https://analytics.google.com/analytics/web/#/p529870904/reports/intelligenthome"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <TrendingUp size={15} />
            Розширена аналітика на Google Analytics
            <ExternalLink size={13} className="opacity-70" />
          </a>
        </div>
      </div>

      {/* Not configured */}
      {!loading && !isConfigured && <SetupInstructions />}

      {/* Error */}
      {!loading && hasError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex items-start gap-3">
          <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-700">Помилка завантаження</p>
            <p className="text-xs text-red-500 mt-1">{data?.error}</p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      {(loading || hasData) && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <KpiSkeleton key={i} />)
          ) : (
            <>
              <KpiCard
                label="Сесії"
                desc="Кількість візитів на сайт"
                value={formatNum(data!.kpis!.sessions)}
                icon={BarChart2}
                color="teal"
              />
              <KpiCard
                label="Користувачі"
                desc="Унікальні відвідувачі"
                value={formatNum(data!.kpis!.users)}
                icon={Users}
                color="blue"
              />
              <KpiCard
                label="Перегляди"
                desc="Відкриті сторінки"
                value={formatNum(data!.kpis!.pageViews)}
                icon={Eye}
                color="purple"
              />
              <KpiCard
                label="Залученість"
                desc="Активні сесії (>10с)"
                value={formatPct(data!.kpis!.engagementRate)}
                icon={MousePointerClick}
                color="amber"
              />
              <KpiCard
                label="Тривалість"
                desc="Середній час користувача"
                value={formatDuration(data!.kpis!.avgSessionDuration)}
                icon={Clock}
                color="rose"
              />
            </>
          )}
        </div>
      )}

      {/* Middle row: Top Pages + Channels */}
      {(loading || hasData) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Dynamics */}
          <div className="lg:col-span-2">
            {loading ? (
              <BlockSkeleton rows={10} />
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col h-full min-h-[300px]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-semibold text-gray-900">Динаміка візитів</h2>
                </div>
                <div className="flex-1 flex items-end gap-1 sm:gap-2 mt-auto pb-4">
                  {data!.dailyDynamics!.map((d, i) => {
                    const heightPct = maxSessions > 0 ? (d.sessions / maxSessions) * 100 : 0;
                    const showLabel = i % Math.ceil(data!.dailyDynamics!.length / 6) === 0 || i === data!.dailyDynamics!.length - 1;
                    return (
                      <div key={i} className="relative flex-1 flex flex-col items-center justify-end h-full min-h-[200px] group">
                        <div
                          className="w-full bg-teal-100 hover:bg-teal-400 rounded-t-sm transition-all duration-300 relative"
                          style={{ height: `${heightPct}%`, minHeight: '4px' }}
                        >
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-10 pointer-events-none">
                            <span className="font-bold">{d.sessions}</span> візитів
                            <br />
                            <span className="text-gray-400 text-[10px]">{d.date}</span>
                          </div>
                        </div>
                        {/* Date label */}
                        <div className="absolute top-full mt-2 w-full text-center">
                          {showLabel && (
                            <span className="text-[10px] text-gray-400 truncate">{d.date}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Channels */}
          <div>
            {loading ? (
              <BlockSkeleton rows={6} />
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-5">Джерела трафіку</h2>
                <div className="space-y-4">
                  {data!.channels!.map((ch, i) => {
                    const channelInfo = CHANNEL_LABELS[ch.name] || { label: ch.name, desc: 'Інше джерело' };
                    return (
                      <div key={i} className="mb-4 last:mb-0">
                        <div className="flex justify-between items-start mb-1.5">
                          <div className="flex-1 pr-3">
                            <p className="text-xs text-gray-800 font-medium truncate" title={`${channelInfo.label} (${ch.name})`}>
                              {channelInfo.label} <span className="text-gray-400 font-normal ml-1">({ch.name})</span>
                            </p>
                            <p className="text-[10px] text-gray-500 truncate mt-0.5" title={channelInfo.desc}>
                              {channelInfo.desc}
                            </p>
                          </div>
                          <span className="text-xs font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded-md tabular-nums shrink-0">
                            {formatNum(ch.sessions)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-teal-500 rounded-full transition-all duration-500"
                              style={{ width: `${ch.pct}%` }}
                            />
                          </div>
                          <div className="text-[10px] w-6 flex-shrink-0 text-right text-gray-400 font-medium">
                            {ch.pct}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom row: Countries + Cities + Devices + Events */}
      {(loading || hasData) && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          {/* Countries */}
          <div>
            {loading ? (
              <BlockSkeleton rows={8} />
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-full">
                <div className="flex items-center gap-2 mb-5">
                  <Globe size={16} className="text-gray-400" />
                  <h2 className="text-sm font-semibold text-gray-900">Країни</h2>
                </div>
                <div className="space-y-4">
                  {data!.countries!.map((c, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-700 font-medium truncate pr-2">{c.name}</span>
                        <span className="text-gray-500 tabular-nums">{formatNum(c.sessions)}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-400 rounded-full transition-all duration-500"
                          style={{ width: `${c.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cities */}
          <div>
            {loading ? (
              <BlockSkeleton rows={8} />
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-full">
                <div className="flex items-center gap-2 mb-5">
                  <Globe size={16} className="text-gray-400" />
                  <h2 className="text-sm font-semibold text-gray-900">Міста</h2>
                </div>
                <div className="space-y-4">
                  {data!.cities!.map((c, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-700 font-medium truncate pr-2">{c.name}</span>
                        <span className="text-gray-500 tabular-nums">{formatNum(c.sessions)}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-400 rounded-full transition-all duration-500"
                          style={{ width: `${c.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Devices */}
          <div>
            {loading ? (
              <BlockSkeleton rows={3} />
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-full">
                <h2 className="text-sm font-semibold text-gray-900 mb-5">Пристрої</h2>
                <div className="space-y-5">
                  {data!.devices!.map((d, i) => {
                    const meta = DEVICE_LABELS[d.name] ?? { label: d.name, Icon: Monitor };
                    const { label, Icon: DevIcon } = meta;
                    return (
                      <div key={i}>
                        <div className="flex items-center gap-2 mb-2">
                          <DevIcon size={15} className="text-gray-400 shrink-0" />
                          <span className="text-sm font-medium text-gray-700 flex-1">{label}</span>
                          <span className="text-sm font-semibold text-gray-900 tabular-nums">{formatNum(d.sessions)}</span>
                          <span className="text-xs text-gray-400 tabular-nums w-8 text-right">{d.pct}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-400 rounded-full transition-all duration-500"
                            style={{ width: `${d.pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Events */}
          <div>
            {loading ? (
              <BlockSkeleton rows={8} />
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-full">
                <div className="flex items-center gap-2 mb-5">
                  <MousePointerClick size={16} className="text-gray-400" />
                  <h2 className="text-sm font-semibold text-gray-900">Події</h2>
                </div>
                <div className="space-y-0 divide-y divide-gray-50">
                  {data!.events!.map((e, i) => {
                    const evt = EVENT_LABELS[e.name] || { label: e.name, desc: 'Системна або інша подія' };
                    return (
                      <div key={i} className="flex justify-between items-center py-2.5 group hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors">
                        <div className="flex-1 min-w-0 pr-3">
                          <p className="text-xs text-gray-800 font-medium truncate" title={`${evt.label} (${e.name})`}>
                            {evt.label} <span className="text-gray-400 font-normal ml-1">({e.name})</span>
                          </p>
                          <p className="text-[10px] text-gray-500 truncate" title={evt.desc}>
                            {evt.desc}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded-md tabular-nums shrink-0 group-hover:bg-teal-50 group-hover:text-teal-700 transition-colors">
                          {formatNum(e.count)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

// --- KPI Card ---
const COLOR_MAP: Record<string, { bg: string; icon: string; text: string }> = {
  teal: { bg: 'bg-teal-50', icon: 'text-teal-600', text: 'text-teal-700' },
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', text: 'text-blue-700' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', text: 'text-purple-700' },
  amber: { bg: 'bg-amber-50', icon: 'text-amber-600', text: 'text-amber-700' },
  rose: { bg: 'bg-rose-50', icon: 'text-rose-600', text: 'text-rose-700' },
};

function KpiCard({
  label,
  desc,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  desc?: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.teal;
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 hover:shadow-md transition-shadow group relative" title={desc}>
      <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center mb-3`}>
        <Icon size={18} className={c.icon} />
      </div>
      <div className="text-2xl font-bold text-gray-900 tabular-nums leading-tight">{value}</div>
      <div className={`text-xs font-semibold ${c.text} mt-1`}>{label}</div>
      {desc && <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{desc}</div>}
    </div>
  );
}
