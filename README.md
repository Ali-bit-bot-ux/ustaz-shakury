# Устаздар — шақыру сайты / Ustaz Invitation Site

**«Ұстаз – ұлы тұлға»** — Ұстаздар күніне арналған интерактивті цифрлы шақыру сайты.

## Папка құрылымы

```
ustaz-shakyru/
├── index.html        # Басты HTML беті
├── style.css         # Стильдер жүйесі (Royal Festive Elegance)
├── script.js         # Интерактивті логика (конверт, RSVP, анимация)
├── README.md         # Осы файл
└── assets/
    └── video.mp4     # Шақыру барысының бейнеролигі
```

## GitHub Pages-ке жүктеу нұсқаулығы

1. GitHub-та жаңа репозиторий жасаңыз (мысалы: `ustaz-shakyru`)
2. Осы папкадағы барлық файлдарды жүктеңіз:
   ```bash
   git init
   git add .
   git commit -m "Initial commit — Ustaz invitation site"
   git branch -M main
   git remote add origin https://github.com/СІЗДІҢ_ЛОГИНІҢІЗ/ustaz-shakyru.git
   git push -u origin main
   ```
3. GitHub → Settings → Pages → Source: **Deploy from branch** → `main` → `/root` → Save
4. Сілтемеңіз дайын: `https://СІЗДІҢ_ЛОГИНІҢІЗ.github.io/ustaz-shakyru/`

## ⚠️ Видео туралы ескертпе

`assets/video.mp4` файлы **125 МБ** болғандықтан, GitHub-қа жүктеу үшін:
- **Git LFS** (Large File Storage) пайдаланыңыз
- Немесе видеоны YouTube-қа жүктеп, iframe арқылы кірістіріңіз
- Немесе Google Drive / Cloudinary арқылы кірістіріңіз

### Git LFS арқылы жүктеу:
```bash
git lfs install
git lfs track "assets/video.mp4"
git add .gitattributes
git add assets/video.mp4
git commit -m "Add video via LFS"
git push
```
