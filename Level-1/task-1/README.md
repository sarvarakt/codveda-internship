# Task 1: Development Environment Setup
**Codveda Full-Stack Development | Level 1**

---

## 1. Node.js va npm Ornatish

### Windows:
1. https://nodejs.org saytiga oting
2. LTS versiyasini yuklab oling va ornatib chiqing

### Tekshirish:
```bash
node -v
npm -v
```

### Yarn (ixtiyoriy):
```bash
npm install -g yarn
yarn -v
```

---

## 2. Git Ornatish

1. https://git-scm.com dan yuklab ornatib chiqing

### Sozlash:
```bash
git config --global user.name "Sizning Ismingiz"
git config --global user.email "sizning@email.com"
git --version
```

---

## 3. VS Code Ornatish

1. https://code.visualstudio.com dan yuklab ornatib chiqing

### Tavsiya etiladigan Extensionlar:
- Prettier - kodni formatlash
- ESLint - xatolarni topish
- Thunder Client - API test qilish
- GitLens - Git tarixi
- MongoDB for VS Code

---

## 4. MongoDB Ornatish

1. https://www.mongodb.com/try/download/community
2. MongoDB Community Server yuklab ornatib chiqing
3. "Install MongoDB as a Service" ni belgilang

### Tekshirish:
```bash
mongod --version
```

---

## 5. GitHub Repository Yaratish

### Qadam 1: GitHub'da yangi repo
1. https://github.com da login qiling
2. "New repository" bosing
3. Nom: codveda-fullstack
4. Public qilib qo'ying
5. "Create repository" bosing

### Qadam 2: Lokal clone
```bash
git clone https://github.com/SIZNING_USERNAME/codveda-fullstack.git
cd codveda-fullstack
```

### Qadam 3: Fayllarni yuklash
```bash
git add .
git commit -m "Codveda Level 1 - All Tasks"
git push origin main
```

---

## 6. Asosiy Terminal Buyruqlari

```bash
# Navigatsiya
cd papka_nomi     # Papkaga kirish
cd ..             # Yuqoriga chiqish
ls / dir          # Tarkibni korish
mkdir nom         # Yangi papka

# Git
git status        # Ozgarishlarni korish
git add .         # Barchasini tayyorlash
git commit -m ""  # Saqlash
git push          # GitHub'ga yuklash
git pull          # GitHub'dan olish

# npm
npm init -y       # Loyiha boshlash
npm install       # Paketlarni ornatish
npm start         # Ishga tushirish
```

---

## Checklist

- [ ] Node.js ornatildi
- [ ] npm ishlayapti
- [ ] Git ornatildi va sozlandi
- [ ] VS Code ornatildi
- [ ] MongoDB ornatildi
- [ ] GitHub akkaunt bor
- [ ] codveda-fullstack repo yaratildi
- [ ] Barcha tasklar GitHub'ga yuklandi
