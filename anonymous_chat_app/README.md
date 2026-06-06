# Proje 3 - Anonymous Chat Application

Bu proje, **Kodluyoruz Bootcamp** kapsamında geliştirilmiş, GraphQL altyapısı ile gerçek zamanlı (Real-time) çalışan anonim bir sohbet uygulamasıdır. Proje, hem istemci (client) hem de sunucu (backend) katmanlarını içerecek şekilde tam yığın (full-stack) olarak tasarlanmıştır.

## 🚀 Özellikler & Gereksinim Karşılamaları

* **GraphQL API & Gerçek Zamanlılık:** Mesaj gönderimi için GraphQL `Mutation` yapısı, yeni gelen mesajları anlık ve eş zamanlı olarak yakalayabilmek için ise GraphQL `Subscription` mimarisi kurulmuştur.
* **Redis PubSub Entegrasyonu:** Sunucu tarafındaki abonelik (Subscription) mesaj trafiği ve gerçek zamanlı veri akışı, performanslı ve ölçeklenebilir **Redis PubSub** yapısı ile organize edilmiştir.
* **Modern Kullanıcı Arayüzü:** React.js kullanılarak bileşen tabanlı geliştirilen arayüz; anlık mesaj akışları, otomatik aşağı kaydırma (auto-scroll) desteği ve kullanıcı dostu mesaj balonları barındırır.
* **Akıllı Hizalama:** Gelen mesajlar gönderen kişinin avatarı ve ismiyle birlikte sol tarafta listelenirken, kullanıcının ("Siz") gönderdiği mesajlar otomatik olarak sağ tarafa dayalı şekilde render edilir.

---

## 🛠️ Kullanılan Teknolojiler

### Backend (Sunucu)
* **Node.js & TypeScript / JavaScript**
* **GraphQL (Apollo Server / GraphQL Yoga)**
* **Redis** (Subscription mesaj trafiğini yönetmek ve PubSub yapısını kurmak için)

### Frontend (İstemci)
* **React.js** (Functional Components & Hooks)
* **Apollo Client** (GraphQL Mutation ve Subscription bağlantıları için)
* **CSS Modules** (Bileşen seviyesinde izole ve temiz stil yönetimi)

---

## 📦 Kurulum ve Çalıştırma

Projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz.

### 1. Ön Gereksinimler
Bilgisayarınızda **Node.js** ve aktif çalışan bir **Redis** sunucusunun (yerel veya Docker üzerinde) kurulu olduğundan emin olun.

### 2. Backend Kurulumu
```bash
# Server dizinine geçiş yapın
cd server

# Bağımlılıkları yükleyin
npm install

# Sunucuyu başlatın
npm run dev
```

### 3. Frontend Kurulumu
```bash
# Client dizinine geçiş yapın
cd client

# Bağımlılıkları yükleyin
npm install

# Sunucuyu başlatın
npm start
```

**SkillCamp.dev (Patika.dev) tarafından düzenlenmiş olan GraphQL eğitimi kapsamında istenilmiş olan ödev projesi başarıyla tamamlanmıştır.**