
/* =================================
   NEXORA - MAIN JAVASCRIPT
================================= */

document.addEventListener("DOMContentLoaded", function () {

    // 1. TAHUN OTOMATIS DI FOOTER
    const currentYear = new Date().getFullYear();
    const footer = document.querySelector("footer");

    if (footer) {
        let yearText = document.getElementById("nexora-year");

        if (!yearText) {
            yearText = document.createElement("p");
            yearText.id = "nexora-year";
            footer.appendChild(yearText);
        }

        yearText.textContent =
            `© ${currentYear} NEXORA. All Rights Reserved.`;
    }


    // 2. EFEK NAVIGASI SAAT SCROLL
    const header = document.querySelector("header");

    function updateHeader() {
        if (header) {
            header.classList.toggle(
                "scrolled",
                window.scrollY > 50
            );
        }
    }

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    updateHeader();


    // 3. SCROLL REVEAL ENGINE

const revealElements =
    document.querySelectorAll("[data-reveal]");

// Hormati pengaturan aksesibilitas
if (
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches
) {
    revealElements.forEach(element => {
        element.classList.add("is-visible");
    });

} else {

    // Aktifkan CSS Scroll Reveal
    document.documentElement.classList.add("reveal-ready");

    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add("is-visible");

                            observer.unobserve(entry.target);
                        }

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -40px 0px"
                }
            );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("is-visible");
        });

    }
}

    // 4. PRICE CALCULATOR
    const packageSelect =
        document.getElementById("package-select");

    const stbSelect =
        document.getElementById("stb-select");

    const promoSelect =
        document.getElementById("promo-select");

    const totalPrice =
        document.getElementById("total-price");

    const serviceDuration =
        document.getElementById("service-duration");

    const calculateButton =
        document.getElementById("calculate-price");

    const whatsappButton =
        document.getElementById("calculator-whatsapp");


    // Pastikan elemen kalkulator tersedia
    if (
        !packageSelect ||
        !stbSelect ||
        !promoSelect ||
        !totalPrice ||
        !calculateButton
    ) {
        console.error(
            "Elemen kalkulator NEXORA tidak ditemukan."
        );
        return;
    }


    // FORMAT RUPIAH
    function rupiah(value) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(value);
    }


    // 5. PROSES PERHITUNGAN
    function calculate() {

        const packagePrice = Number(packageSelect.value);
        const stbMonthly = Number(stbSelect.value);
        const promo = Number(promoSelect.value);

        const admin = 5000;
        const ppn = 0.11;

        let paidMonths = 1;
        let serviceMonths = 1;

        if (promo === 5) {
            paidMonths = 5;
            serviceMonths = 6;

        } else if (promo === 9) {
            paidMonths = 9;
            serviceMonths = 12;
        }


        // PERHITUNGAN INTERNET
        const internetCost =
            packagePrice * paidMonths;


        // PERHITUNGAN STB
        const stbCost =
            stbMonthly * serviceMonths;


        // ADMIN SEKALI BAYAR
        const subtotal =
            internetCost + stbCost + admin;


        // PPN 11%
        const tax =
            Math.round(subtotal * ppn);


        // TOTAL PEMBAYARAN
        const total =
            subtotal + tax;


        // TAMPILKAN HASIL
        totalPrice.textContent = rupiah(total);

        if (serviceDuration) {
            serviceDuration.textContent =
                promo === 0
                    ? "Pembayaran untuk 1 bulan"
                    : `Bayar ${paidMonths} bulan, layanan ${serviceMonths} bulan`;
        }


        return {
            packagePrice,
            stbMonthly,
            stbCost,
            internetCost,
            paidMonths,
            serviceMonths,
            admin,
            subtotal,
            tax,
            total
        };

    }


    // 6. EVENT TOMBOL HITUNG
    calculateButton.addEventListener(
        "click",
        calculate
    );


    // 7. HITUNG OTOMATIS SAAT PILIHAN BERUBAH
    packageSelect.addEventListener(
        "change",
        calculate
    );

    stbSelect.addEventListener(
        "change",
        calculate
    );

    promoSelect.addEventListener(
        "change",
        calculate
    );


    // 8. INFORMASI SPEED BOOST
    const speedBoostMap = {
        "Fiber Home 150": "150 Mbps up to 300 Mbps",
        "Fiber Home 200": "200 Mbps up to 400 Mbps",
        "Fiber Home 300": "300 Mbps up to 500 Mbps",
        "Fiber Safe 150": "150 Mbps up to 350 Mbps",
        "Fiber Safe 200": "200 Mbps up to 500 Mbps",
        "Fiber Safe 300": "300 Mbps up to 600 Mbps"
    };


    // 9. PENDAFTARAN MELALUI WHATSAPP
    if (whatsappButton) {

        whatsappButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const result = calculate();

                const packageName =
                    packageSelect.options[
                        packageSelect.selectedIndex
                    ].text;


                // INFORMASI PROMO
                const promoName =
                    result.paidMonths === 5
                        ? "Pay 5 Get 1"
                        : result.paidMonths === 9
                            ? "Pay 9 Get 3"
                            : "Bulanan";


                // INFORMASI STB
                const stbDescription =
                    result.stbMonthly === 0
                        ? "Tanpa STB"
                        : `${rupiah(result.stbMonthly)} × ${result.serviceMonths} bulan = ${rupiah(result.stbCost)}`;


                // SPEED BOOST
                const speedBoost =
                    speedBoostMap[packageName] ||
                    "Hubungi admin untuk informasi";


                // TEMPLATE PESAN WHATSAPP
                const message =
`Halo NEXORA, saya ingin mendaftar CBN Fiber.

Paket: ${packageName}
Speed Boost: ${speedBoost}
Promo: ${promoName}

Harga paket: ${rupiah(result.packagePrice)} × ${result.paidMonths} bulan
Total paket: ${rupiah(result.internetCost)}

STB: ${stbDescription}
Admin: ${rupiah(result.admin)}
Subtotal: ${rupiah(result.subtotal)}
PPN 11%: ${rupiah(result.tax)}

Total pembayaran: ${rupiah(result.total)}
Masa layanan: ${result.serviceMonths} bulan.

Mohon informasi pendaftaran selanjutnya. Terima kasih.`;


                // NOMOR WHATSAPP
                const phone = "6285795247355";


                // BUKA WHATSAPP
                window.open(
                    "https://wa.me/" + phone +
                    "?text=" + encodeURIComponent(message),
                    "_blank"
                );

            }
        );

    }


    // 10. HARGA AWAL KALKULATOR
    calculate();

    console.log("NEXORA berhasil dijalankan!");

});
/* =================================
   NEXORA - SCROLL REVEAL ENGINE
================================= */

(function () {
    const elements = document.querySelectorAll("[data-reveal]");

    if (!elements.length) return;

    // Hormati pengaturan aksesibilitas pengguna
    if (window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches) {
        return;
    }

    // Aktifkan animasi setelah JavaScript siap
    document.documentElement.classList.add("reveal-ready");

    // Fallback jika IntersectionObserver tidak tersedia
    if (!("IntersectionObserver" in window)) {
        elements.forEach(element => {
            element.classList.add("is-visible");
        });
        return;
    }

    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");

                    // Animasi cukup sekali
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    elements.forEach(element => {
        observer.observe(element);
    });
})();

/* =================================
   NEXORA - SCROLL PARALLAX ENGINE
================================= */

(function () {

    const orbs = document.querySelectorAll(
        ".nexora-orb"
    );

    if (!orbs.length) return;

    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) return;

    let ticking = false;

    function updateParallax() {

        const scrollY = window.scrollY;

        orbs.forEach((orb, index) => {

            const speed = [0.10, -0.07, 0.05][index];

            const movement = scrollY * speed;

            orb.style.transform =
                `translate3d(0, ${movement}px, 0)`;

        });

        ticking = false;
    }

    window.addEventListener(
        "scroll",
        function () {

            if (!ticking) {

                window.requestAnimationFrame(
                    updateParallax
                );

                ticking = true;
            }

        },
        { passive: true }
    );

    updateParallax();

})();

