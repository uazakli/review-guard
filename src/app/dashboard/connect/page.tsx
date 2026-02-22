import ConnectGoogleBusiness from '@/components/dashboard/ConnectGoogleBusiness';

export default function ConnectPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">İşletme Bağla</h1>
                <p className="text-gray-600 mb-8">
                    Yorumlarını yönetmek istediğiniz Google İşletme Profilini seçin.
                </p>

                <ConnectGoogleBusiness />
            </div>
        </div>
    );
}
