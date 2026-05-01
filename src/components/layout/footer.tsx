export function Footer() {
  return (
    <footer className="border-t border-slate-700 bg-slate-800 text-slate-100">
      <div className="mx-auto max-w-[1440px] px-3 py-6">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr_1fr_1fr]">
          <section>
            <h3 className="text-[18px] font-bold text-white">About Us</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-200">
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Customers</a></li>
              <li><a href="#" className="hover:text-white">Suppliers</a></li>
              <li><a href="#" className="hover:text-white">Impact</a></li>
              <li><a href="#" className="hover:text-white">Investors</a></li>
              <li><a href="#" className="hover:text-white">Media</a></li>
            </ul>

            <div className="mt-8">
              <h4 className="text-[18px] font-bold text-white">Sign Up For Email</h4>
              <div className="mt-3 flex max-w-[340px] overflow-hidden border border-slate-300 bg-white">
                <input
                  type="email"
                  aria-label="Email Address"
                  placeholder="Email Address"
                  className="h-10 flex-1 px-4 text-sm text-slate-900 outline-none"
                />
                <button
                  type="button"
                  className="h-10 border-l border-slate-300 bg-slate-700 px-4 text-sm font-bold text-white hover:bg-slate-600"
                >
                  Submit
                </button>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-[18px] font-bold text-white">Order Support</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-200">
              <li><a href="#" className="hover:text-white">Existing Orders</a></li>
              <li><a href="#" className="hover:text-white">Returns, Warranty and Cancellations</a></li>
              <li><a href="#" className="hover:text-white">Extended Protection Plan</a></li>
              <li><a href="#" className="hover:text-white">Invoices</a></li>
              <li><a href="#" className="hover:text-white">Special Orders</a></li>
            </ul>
          </section>

          <section>
            <h3 className="text-[18px] font-bold text-white">FactoryPeer's Got Your Back</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-200">
              <li><a href="#" className="hover:text-white">FactoryPeer KnowHow</a></li>
              <li><a href="#" className="hover:text-white">Product Collections</a></li>
              <li><a href="#" className="hover:text-white">Services and Solutions</a></li>
              <li><a href="#" className="hover:text-white">Industries</a></li>
            </ul>

            {/* Mobile app promo removed per request */}
          </section>

          <section>
            <h3 className="text-[18px] font-bold text-white">Connect</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-200">
              <li><a href="#" className="italic hover:text-white">Call Us (1-800-SUPPLY)</a></li>
              <li><a href="#" className="hover:text-white">Branch Locations</a></li>
              <li><a href="#" className="hover:text-white">Catalog Request</a></li>
              <li><a href="#" className="hover:text-white">Help</a></li>
            </ul>

            <div className="mt-8 flex gap-2">
              {[
                ["f", "bg-[#3b5998]"],
                ["in", "bg-[#0a66c2]"],
                ["▶", "bg-[#ff0000]"],
                ["t", "bg-[#1da1f2]"],
                ["ig", "bg-[#b029a3]"],
              ].map(([label, bg]) => (
                <span
                  key={label}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${bg}`}
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-8">
              <p className="text-[18px] font-bold text-white">Feedback</p>
              <button
                type="button"
                className="mt-3 inline-flex h-10 items-center justify-center rounded-sm border-2 border-white px-5 text-sm font-bold text-white hover:bg-white hover:text-slate-800"
              >
                Help Us Improve
              </button>
            </div>
          </section>
        </div>
      </div>

      <div className="border-t border-slate-700 bg-black">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-3 px-3 py-5 text-center text-xs text-slate-200 lg:flex-row lg:justify-center lg:gap-4">
          <a href="#" className="hover:text-white">Terms of Access</a>
          <span className="hidden text-slate-500 lg:inline">|</span>
          <a href="#" className="hover:text-white">Terms of Sale</a>
          <span className="hidden text-slate-500 lg:inline">|</span>
          <a href="#" className="hover:text-white">Shipping and Delivery</a>
          <span className="hidden text-slate-500 lg:inline">|</span>
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <span className="hidden text-slate-500 lg:inline">|</span>
          <a href="#" className="hover:text-white">Sitemap</a>
          <span className="hidden text-slate-500 lg:inline">|</span>
          <a href="#" className="hover:text-white">Accessibility Statement</a>
        </div>
        <p className="pb-5 text-center text-xs text-slate-300">
          © 1994 - 2026, FactoryPeer, Inc. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
