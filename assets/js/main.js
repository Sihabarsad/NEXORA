
/* =================================
   NEXORA - MAIN JAVASCRIPT
================================= */

// 1. TAHUN OTOMATIS DI FOOTER
const currentYear = new Date().getFullYear();
const footer = document.querySelector("footer");

if (footer) {
    const yearText = document.createElement("p");
    yearText.textContent = `© ${currentYear} NEXORA. All Rights Reserved.`;
    footer.appendChild(yearText);
}


// 2. EFEK NAVIGASI SAAT SCROLL
const header = document.querySelector("header");

window.addEventListener("scroll", function () {
    if (header) {
        header.classList.toggle("scrolled", window.scrollY > 50);
    }
});


// 3. ANIMASI SECTION
const sections = document.querySelectorAll("section");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    sections.forEach(function (section) {
        section.classList.add("reveal");
        observer.observe(section);
    });
}


// 4. EFEK TOMBOL
document.querySelectorAll(".btn").forEach(function (button) {
    button.addEventListener("click", function () {
        button.style.opacity = "0.8";

        setTimeout(function () {
            button.style.opacity = "1";
        }, 180);
    });
});



/* =================================
   NEXORA - PRICE CALCULATOR
================================= */

document.addEventListener("DOMContentLoaded", function () {

    const packageSelect = document.getElementById("package-select");
    const stbSelect = document.getElementById("stb-select");
    const promoSelect = document.getElementById("promo-select");

    const totalPrice = document.getElementById("total-price");
    const serviceDuration = document.getElementById("service-duration");

    const calculateButton = document.getElementById("calculate-price");
    const whatsappButton = document.getElementById("calculator-whatsapp");

    if (
        !packageSelect || !stbSelect || !promoSelect ||
        !totalPrice || !calculateButton
    ) {
        console.error("Elemen kalkulator NEXORA tidak ditemukan.");
        return;
    }

    /**
 * @param {number} value
 * @returns {string}
 */
function rupiah(value) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(value);
}

    
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
    const internetCost = packagePrice * paidMonths;

    // PERHITUNGAN STB SESUAI MASA LAYANAN
const stbCost = stbMonthly * serviceMonths;

    // ADMIN SEKALI BAYAR
    const subtotal = internetCost + stbCost + admin;

    // PPN 11%
    const tax = Math.round(subtotal * ppn);

// TOTAL PEMBAYARAN
const total = subtotal + tax;

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


    // Tombol hitung
    calculateButton.addEventListener("click", calculate);

    // Hitung otomatis saat pilihan berubah
    packageSelect.addEventListener("change", calculate);
    stbSelect.addEventListener("change", calculate);
    promoSelect.addEventListener("change", calculate);

    // WhatsApp
    if (whatsappButton) {
        whatsappButton.addEventListener("click", function (event) {

            event.preventDefault();

            const result = calculate();

            const packageName =
                packageSelect.options[packageSelect.selectedIndex].text;

            
const promoName =
    result.paidMonths === 5 ? "Pay 5 Get 1" :
    result.paidMonths === 9 ? "Pay 9 Get 3" :
    "Bulanan";


const stbDescription =
    result.stbMonthly === 0
        ? "Tanpa STB"
        : `${rupiah(result.stbMonthly)} × ${result.serviceMonths} bulan = ${rupiah(result.stbCost)}`;



// INFORMASI SPEED BOOST
const speedBoostMap = {
    "Fiber Home 150": "150 Mbps up to 300 Mbps",
    "Fiber Home 200": "200 Mbps up to 400 Mbps",
    "Fiber Home 300": "300 Mbps up to 500 Mbps",
    "Fiber Safe 150": "150 Mbps up to 350 Mbps",
    "Fiber Safe 200": "200 Mbps up to 500 Mbps",
    "Fiber Safe 300": "300 Mbps up to 600 Mbps"
};

const speedBoost = speedBoostMap[packageName] || "Hubungi admin untuk informasi";

// TEMPLATE PESAN WHATSAPP
const message =
`Halo NEXORA, saya ingin mendaftar CBN Fiber.

Paket: ${packageName}
Speed Boost: ${speedBoost}
Promo: ${promoName}

Harga paket: ${rupiah(result.packagePrice)} × ${result.paidMonths} bulan
Total paket: ${rupiah(result.packagePrice * result.paidMonths)}

STB: ${stbDescription}
Admin: ${rupiah(result.admin)}
Subtotal: ${rupiah(result.subtotal)}
PPN 11%: ${rupiah(result.tax)}

Total pembayaran: ${rupiah(result.total)}
Masa layanan: ${result.serviceMonths} bulan.

Mohon informasi pendaftaran selanjutnya. Terima kasih.`;


            const phone = "6285795247355";

            window.open(
                "https://wa.me/" + phone +
                "?text=" + encodeURIComponent(message),
                "_blank"
            );
        });
    }

    // Harga awal
    calculate();

    console.log("Kalkulator NEXORA aktif!");
});






                          
