# Botfusions Marketing Dashboard - Katkıda Bulunma Rehberi

Botfusions Marketing Dashboard projemize katkıda bulunmak için bu rehberi takip edin.

## 🚀 Başlangıç

### 1. Repository'i Fork Edin
```bash
git clone https://github.com/botfusions/botfusions-dashboardv2.git
cd botfusions-dashboard
```

### 2. Bağımlılıkları Yükleyin
```bash
pnpm install
```

### 3. Development Server'ı Başlatın
```bash
pnpm dev
```

## 📋 Geliştirme Süreci

### Branch Adlandırması
- Feature: `feature/feature-name`
- Bug Fix: `bugfix/issue-name`
- Hotfix: `hotfix/critical-issue`

Örnek:
```bash
git checkout -b feature/add-export-functionality
```

### Commit Mesajları

Conventional Commits standardını takip edin:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: Yeni feature
- `fix`: Bug fix
- `docs`: Dokumentasyon
- `style`: Kod stili (formatting, semicolons, etc)
- `refactor`: Kod refactoring
- `perf`: Performance improvement
- `test`: Test ekleme/güncelleme

**Örnekler:**
```bash
git commit -m "feat(dashboard): add export to CSV functionality"
git commit -m "fix(chat): resolve message truncation issue"
git commit -m "docs: update API documentation"
```

### Pull Request Süreci

1. **Branch oluşturun** ve değişikliklerinizi yapın
2. **Local test edin**:
   ```bash
   pnpm lint
   pnpm build
   ```
3. **GitHub'a push edin**:
   ```bash
   git push origin feature/feature-name
   ```
4. **Pull Request oluşturun** ana branch'e
5. **Code Review** bekleyin

## 🧪 Testing

### Test Çalıştırın
```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:coverage
```

### Coverage Hedefleri
- Minimum: 80%
- Ideal: 90%+

## 📝 Kod Standartları

### TypeScript
- Strict mode kullanın
- Type safety'yi her zaman sağlayın
- Generics kullanımını minimize edin

### React Components
- Functional components (hooks) kullanın
- Props'ları TypeScript ile type edin
- Memoization'ı gerektiği zaman kullanın

### Naming Conventions
```typescript
// Components: PascalCase
const DashboardLayout = () => {}

// Functions: camelCase
const fetchMetrics = () => {}

// Constants: UPPER_SNAKE_CASE
const API_TIMEOUT = 5000

// Types: PascalCase
type UserRole = 'admin' | 'editor' | 'viewer'
```

## 🎨 Stil Rehberi

### Tailwind CSS
- Pre-defined color palette kullanın
- Custom styles'dan kaçının
- Responsive design'ı her zaman implement edin

### Renk Paleti
```css
/* Primary Colors */
--bg-primary: #0D0C12
--bg-secondary: #1A1820
--color-purple: #7B3FE4
--color-blue: #2F89FC

/* Semantic Colors */
--color-success: #4ADE80
--color-warning: #FBBF24
--color-error: #EF4444
```

## 📚 Dokumentasyon

Aşağıdakileri dokümante edin:
- Yeni APIs
- Complex functions
- Database schema changes
- Configuration options

## 🔐 Security

- Secret'ları `.env` dosyasında tutun
- API keys'ı code'a commit etmeyin
- SQL injection'dan kaçının
- CORS policies'i doğru yapılandırın
- RLS policies'i kontrol edin

## 🚨 Önemli Notlar

### Supabase Migration'ları
Yeni tablo/column eklediğinizde:
1. `supabase/migrations/` klasöründe SQL dosyası oluşturun
2. RLS policies'i ayarlayın
3. Indexes oluşturun (performance için)

### Edge Functions
Edge Functions güncellemelerinde:
1. Local test edin: `supabase functions serve`
2. Deno format/lint: `deno fmt` ve `deno lint`
3. Type safety kontrol edin

## 📞 İletişim

- **Issues**: GitHub Issues kullanın
- **Discussions**: GitHub Discussions
- **Email**: [email protected]

## 📖 Kaynaklar

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## ✅ Kontrol Listesi (PR Öncesi)

- [ ] Kod linted ve formatted
- [ ] TypeScript errors yok
- [ ] Tests pass ediyor
- [ ] Build succeeds
- [ ] README/docs güncellendi (gerekirse)
- [ ] Breaking changes belirtildi (gerekirse)
- [ ] Commit mesajları clear ve descriptive

---

**Katkılarınız için teşekkürler! 🎉**
