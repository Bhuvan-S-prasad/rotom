import { AccountSettingsCards, ChangePasswordCard, DeleteAccountCard } from "@daveyplate/better-auth-ui"

export default function SettingsPage() {
    return (
        <div className="w-full mt-20 pt-5 pb-20 flex flex-col items-center">
            <div className="flex flex-col gap-6">
                <AccountSettingsCards className="w-sm" />
                <ChangePasswordCard className="w-sm" />
                <DeleteAccountCard className="w-sm" />
            </div>
        </div>
    )
}