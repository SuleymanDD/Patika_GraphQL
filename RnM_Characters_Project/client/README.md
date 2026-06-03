# Rick and Morty Characters Web App 🚀

Bu proje, hazır bir GraphQL backend mimarisini kullanarak Rick and Morty evrenindeki karakterleri listelemek, aramak ve dinamik olarak filtrelemek amacıyla geliştirilmiş dinamik bir **React** uygulamasıdır.

🔗 **Canlı Önizleme:** [Proje Canlı Linki](https://senin-netlify-veya-vercel-linkin.netlify.app)

---

## 📌 Proje Amacı ve Gereksinimleri

Bu çalışma bir ödev projesi kapsamında geliştirilmiş olup, aşağıdaki temel isterleri eksiksiz bir şekilde yerine getirmektedir:

*   **Görsel Listeleme:** Tüm karakterler, fotoğrafları ve temel bilgileriyle birlikte anasayfada şık bir arayüzle listelenir.
*   **Sayfalama (Pagination):** Büyük veri setleri arasında rahatça gezinmek için karakter listesinde sayfalama yapısı entegre edilmiştir.
*   **Arama Fonksiyonu:** Arama input'u aracılığıyla isim, açıklama veya lokasyona göre anlık karakter araması yapılabilir.
*   **Gelişmiş Filtreleme:** Kullanıcılar cinsiyet (Gender), tür (Species) veya lokasyon (Location) seçimleri yaparak karakterleri daraltabilir.
*   **Filtre Temizleme:** Seçilen tüm filtreleri tek bir tıkla sıfırlayan "Clear Filters" mekanizması mevcuttur.

---

## 🛠️ Kullanılan Teknolojiler ve Kütüphaneler

Projeyi modern web standartlarına ve performans optimizasyonlarına uygun olarak şu araçlarla geliştirdim:

*   **Frontend Framework:** React (Vite ile optimize edilmiş geliştirme ortamı)
*   **Data Fetching & State Management:** GraphQL & Apollo Client (Backend verilerini performanslı sorgulamak ve önbelleğe almak için)
*   **Styling / Tasarım:** CSS / [Kullandığın UI kütüphanesi varsa buraya yaz örn: Tailwind CSS, Material UI]
*   **Deployment:** Netlify

---

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz:

1.  **Projeyi Klonlayın:**
```bash
    git clone [https://github.com/kullanici-adin/repo-adin.git](https://github.com/kullanici-adin/repo-adin.git)
    cd repo-adin
    ```

2.  **Bağımlılıkları Yükleyin:**
```bash
    npm install
    # veya
    yarn install
    ```

3.  **Projeyi Lokalde Başlatın:**
```bash
    npm run dev
    # veya
    yarn dev
    ```
    Tarayıcınızda `http://localhost:5173` (veya terminalde belirtilen port) adresini açarak uygulamayı test edebilirsiniz.

---

## 📋 Veri Kaynağı

Uygulama, veri iletişimi için herkese açık olan resmi [Rick and Morty GraphQL API](https://rickandmortyapi.com/graphql) altyapısını kullanmaktadır.

---
İyi eğlenceler! 🌌 "Wubba Lubba Dub Dub!"