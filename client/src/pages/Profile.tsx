import { UserProfile } from '@clerk/react';

export default function Profile() {
    return (
        <div className="editor-panel rounded-3xl p-3 sm:p-6">
            <UserProfile
                path="/profile"
                routing="path"
                appearance={{
                    variables: {
                        colorBackground: '#0d0d14',
                        colorPrimary: '#8b5cf6',
                        colorText: '#f4f4f5',
                        colorTextSecondary: '#a1a1aa',
                        colorDanger: '#fb7185',
                        colorInputText: '#f4f4f5',
                        colorInputBackground: '#171821',
                    },
                    elements: {
                        cardBox: 'shadow-none border border-white/12 bg-[#0d0d14]',
                        navbar: 'bg-[#0d0d14]',
                        navbarButton: 'text-zinc-300 hover:bg-[#171821] hover:text-zinc-100',
                        pageScrollBox: 'bg-[#0d0d14]',
                        formButtonPrimary: 'bg-violet-500 text-white hover:bg-violet-400',
                        profileSectionTitleText: 'text-zinc-100',
                        profileSectionPrimaryButton: 'text-violet-200 hover:text-violet-100',
                    },
                }}
            />
        </div>
    );
}
