const navigationSocial = [
    {
        name: 'Twitter',
        href: 'https://twitter.com/secondbrain_fyi',
        icon: (props) => (
            <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
        ),
    },
    {
        name: 'YouTube',
        href: 'https://www.youtube.com/@secondbrain_fyi?sub_confirmation=1',
        icon: (props) => (
            <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                <path
                    fillRule="evenodd"
                    d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                    clipRule="evenodd"
                />
            </svg>
        ),
    },
]
const navigationMain = [
    {
        name: 'Privacy Policy',
        href: '/privacy'
    },
    {
        name: 'Terms of Service',
        href: '/terms'
    },
    {
        name: 'Manage Subscription',
        href: 'https://billing.stripe.com/p/login/eVafZb5KMgDodnGcMM'
    }
]

export default function SimpleFooter() {
    return (
        <footer className="bg-white">
            <div className="mx-auto max-w-7xl overflow-hidden py-20 px-6 sm:py-24 lg:px-8">
                <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
                    {navigationMain.map((item) => (
                        <div key={item.name} className="pb-6">
                            <a href={item.href} className="text-sm leading-6 text-gray-600 hover:text-gray-900">
                                {item.name}
                            </a>
                        </div>
                    ))}
                </nav>
                <div className="mt-10 flex justify-center space-x-10">
                    {navigationSocial.map((item) => (
                        <a key={item.name} href={item.href} className="text-gray-400 hover:text-gray-500">
                            <span className="sr-only">{item.name}</span>
                            <item.icon className="h-6 w-6" aria-hidden="true" />
                        </a>
                    ))}
                </div>
                <p className="mt-10 text-center text-xs leading-5 text-gray-500">
                    &copy; 2023 <a href="https://www.indianappguy.com">IndianAppGuy Tech PVT LTD</a>. All rights reserved.
                </p>
            </div>
        </footer>
    )
}
