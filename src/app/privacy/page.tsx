import Link from 'next/link';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-6 py-24">
                <div className="mb-8">
                    <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
                        &larr; Ana Sayfaya Dön
                    </Link>
                </div>

                <h1 className="text-4xl font-bold text-slate-900 mb-8">Gizlilik Politikası (Privacy Policy)</h1>

                <div className="prose prose-slate max-w-none">
                    <p className="text-lg text-slate-600 mb-6">
                        Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Giriş</h2>
                    <p>
                        Review Guard ("biz", "bizim"), kullanıcılarımızın gizliliğini korumayı taahhüt eder.
                        Bu Gizlilik Politikası, hizmetlerimizi kullandığınızda topladığımız, kullandığımız ve paylaştığımız bilgileri açıklar.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Toplanan Bilgiler</h2>
                    <p>
                        Hizmetimizi sağlamak için aşağıdaki bilgileri toplayabiliriz:
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Google Hesabı bilgileri (E-posta, İsim, Profil Resmi)</li>
                            <li>Google İşletme Profili verileri (İşletme Adı, Yorumlar, Puanlar)</li>
                            <li>Kullanım verileri ve analizler</li>
                        </ul>
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Google Kullanıcı Verileri Politikası</h2>
                    <p className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-900 font-medium">
                        Uygulamamız, Google API Hizmetleri Kullanıcı Verileri Politikası'na tam uyum sağlar.
                        Google hesaplarınızdan elde edilen bilgiler, yalnızca uygulamanın temel işlevlerini (yorumları görüntüleme ve yanıtlama)
                        sağlamak amacıyla kullanılır. Bu veriler, reklam amaçlı kullanılmaz ve kullanıcının açık rızası olmadan
                        hiçbir üçüncü taraf ile paylaşılmaz.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Veri Kullanımı</h2>
                    <p>
                        Topladığımız verileri şu amaçlarla kullanırız:
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Google İşletme Yorumlarınıza yapay zeka destekli yanıtlar oluşturmak</li>
                            <li>İşletme performansınızı analiz etmek ve raporlamak</li>
                            <li>Hesap güvenliğinizi sağlamak</li>
                        </ul>
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. İletişim</h2>
                    <p>
                        Gizlilik politikamızla ilgili sorularınız için bizimle iletişime geçebilirsiniz:
                        <br />
                        <strong>E-posta:</strong> contact@reviewguard.com
                    </p>
                </div>
            </div>
        </div>
    );
}
