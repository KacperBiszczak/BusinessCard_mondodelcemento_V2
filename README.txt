WIZYTÓWKA INTERNETOWA — NAZWA FIRMY
Mikrocement i posadzki żywiczne
=====================================================

AKTUALIZACJA — poprawki responsywności i jakości
-----------------------------------------------------
Względem pierwszej wersji poprawiono m.in.:
• Diagram warstw w hero — opisy nie są już tekstem w SVG (nieczytelnym
  po zmniejszeniu), tylko zwykłą listą HTML, czytelną na każdym ekranie.
• Menu mobilne — dodano przycisk "Bezpłatna wycena" wewnątrz panelu,
  tło (backdrop), zamykanie klawiszem Escape i kliknięciem w tło.
• Kliknięcie linku w menu nie chowa już nagłówka sekcji pod paskiem nawigacji.
• Przyciski w hero układają się w kolumnę na bardzo małych telefonach.
• Dodano pośredni układ 2-kolumnowy (tablet) dla produktów i opinii.
• Kolor akcentu (brąz/żywica) przyciemniono, by spełniał kontrast WCAG AA.
• Ikony dekoracyjne oznaczono aria-hidden (czytniki ekranu).
• Dodano favicon (img/favicon.svg — tymczasowy, podmień na swoje logo),
  meta Open Graph/Twitter, canonical i dane strukturalne LocalBusiness
  (do uzupełnienia prawdziwymi danymi w <head> pliku index.html).
• php/contact.php: biała lista pola "temat", walidacja formatu telefonu,
  poprawka błędu przy adresie hosta zawierającym port.

STRUKTURA PLIKÓW
-----------------------------------------------------
index.html          — cała strona (treść + sekcje)
css/style.css        — wygląd (kolory, typografia, layout)
js/script.js          — menu, akordeon FAQ, animacje, obsługa formularza
php/contact.php        — wysyłka formularza na e-mail
img/favicon.svg        — tymczasowa ikona karty (podmień na swoje logo)

WYMAGANIA HOSTINGU
-----------------------------------------------------
• Dowolny hosting z obsługą PHP 7.4+ (np. home.pl, nazwa.pl,
  cyberfolks.pl, OVH, LH.pl — każdy standardowy hosting współdzielony).
• Funkcja PHP mail() musi być włączona (jest domyślnie u większości
  polskich dostawców). Jeśli maile nie dochodzą — patrz sekcja
  "Jeśli wiadomości nie dochodzą" poniżej.
• Strona NIE wymaga bazy danych.

JAK WGRAĆ (skrót)
-----------------------------------------------------
1. Wgraj całą zawartość tego folderu (index.html, css/, js/, php/)
   do głównego katalogu hostingu (najczęściej public_html/ lub
   htdocs/) przez FTP lub panel plików hostingu.
2. Otwórz php/contact.php i na samej górze zmień:
     const ODBIORCA_EMAIL = 'kontakt@twojafirma.pl';
   na swój prawdziwy adres e-mail.
3. Gotowe — formularz w sekcji "Kontakt" zacznie wysyłać wiadomości.

CO TRZEBA PODMIENIĆ PRZED PUBLIKACJĄ
-----------------------------------------------------
1. LOGO
   W index.html znajdziesz dwa miejsca z placeholderem logo:
     <span class="logo-slot__mark">LOGO</span>
     <span class="logo-slot__word">NAZWA FIRMY</span>
   (w nagłówku i w stopce). Podmień na:
     <img src="img/logo.svg" alt="Nazwa Firmy" class="logo-slot__img">
   i dodaj własny plik graficzny do folderu img/.

2. NAZWA FIRMY, dane kontaktowe, adres, telefon, e-mail
   — występują w kilku miejscach: nagłówek, sekcja Kontakt, stopka,
   <title> i meta description w <head>. Użyj Ctrl+F i wyszukaj:
     NAZWA FIRMY / +48 000 000 000 / kontakt@twojafirma.pl /
     ul. Przykładowa 1, 00-000 Miasto / [Twoje miasto]

3. ZDJĘCIA REALIZACJI
   W hero i w trzech kartach w sekcji "Powierzchnie" wstawione są
   gotowe obrazy zastępcze (img/realizacja-hero.jpg,
   img/realizacja-mikrocement.jpg, img/realizacja-zywica.jpg,
   img/realizacja-dekoracyjne.jpg) — jasne tło z podpisem, w tonacji
   strony. Żeby podmienić na własne zdjęcie, wystarczy:
   a) wgrać swoje zdjęcie do folderu img/ (najlepiej w podobnych
      proporcjach: hero 16:10, karty produktów 4:3),
   b) w index.html zmienić tylko atrybut src przy odpowiednim <img>,
      np.:
        <img src="img/realizacja-mikrocement.jpg" ...>
      zamienić na:
        <img src="img/twoje-zdjecie.jpg" ...>
   Reszta (zaokrąglenie rogów, przycięcie, ramka) dostosuje się
   automatycznie — nie trzeba nic zmieniać w CSS.

4. MAPA ZASIĘGU
   Sekcja "Zasięg działania" ma placeholder na mapę. Możesz wstawić
   osadzoną mapę Google (Google Maps → Udostępnij → Umieść mapę →
   skopiuj kod <iframe> i wklej w miejsce diva .coverage-map).

5. OPINIE KLIENTÓW
   Sekcja "Opinie" zawiera przykładowe, fikcyjne opinie — podmień na
   prawdziwe wypowiedzi klientów (najlepiej za ich zgodą).

6. LINKI SPOŁECZNOŚCIOWE
   W sekcji Kontakt i w stopce podmień href="#" przy ikonach
   Instagram / Facebook na prawdziwe adresy profili.

7. POLITYKA PRYWATNOŚCI / REGULAMIN
   Formularz zawiera zgodę RODO z linkiem do polityki prywatności
   (obecnie href="#"). Przed publikacją dodaj prawdziwą podstronę
   z polityką prywatności — jest to wymagane prawnie przy zbieraniu
   danych z formularza.

8. ADRES STRONY (SEO)
   W <head> pliku index.html podmień placeholder domeny
   "https://twojafirma.pl/" na prawdziwy adres w trzech miejscach:
   <link rel="canonical">, <meta property="og:url"> oraz pole "url"
   w danych strukturalnych (JSON-LD na dole <head>). Tam też uzupełnij
   prawdziwy adres/telefon w sekcji "address", jeśli różni się od tych
   już wpisanych w treści strony. Warto też dodać og:image (1200×630 px)
   ze zdjęciem realizacji, gdy już je wgrasz.

JEŚLI WIADOMOŚCI NIE DOCHODZĄ
-----------------------------------------------------
Funkcja mail() w PHP czasem trafia do SPAM-u lub jest blokowana przez
hosting, jeśli domena nie ma poprawnie skonfigurowanych rekordów SPF/DKIM.
Jeśli po wdrożeniu formularz "wysyła" (pokazuje komunikat sukcesu), ale
maile nie docierają:
  • Sprawdź folder SPAM w skrzynce ODBIORCA_EMAIL.
  • Zapytaj dział pomocy hostingu, czy mail() jest włączone dla Twojego
    planu.
  • Najpewniejsze rozwiązanie: wysyłka przez SMTP (np. przez skrzynkę
    firmową lub usługę typu Brevo / SMTP2GO / Resend) za pomocą
    biblioteki PHPMailer zamiast funkcji mail(). To wymaga niewielkiej
    rozbudowy php/contact.php — daj znać, jeśli chcesz taką wersję.

BEZPIECZEŃSTWO FORMULARZA
-----------------------------------------------------
• Pole "website" w formularzu to ukryty honeypot — wychwytuje boty,
  nie usuwaj go z HTML.
• Serwer waliduje dane niezależnie od przeglądarki (imię, e-mail,
  długość wiadomości).
• Wprowadzono proste ograniczenie: 1 wiadomość na 30 sekund z tej
  samej sesji, żeby utrudnić spamowanie formularza.

DOSTĘPNOŚĆ I WYDAJNOŚĆ
-----------------------------------------------------
• Strona jest w pełni responsywna (telefon / tablet / desktop).
• Nawigacja klawiaturą i czytniki ekranu: widoczny focus, etykiety
  aria, link "Przejdź do treści".
• Animacje wyłączają się automatycznie, jeśli użytkownik ma włączone
  "Ogranicz animacje" w systemie (prefers-reduced-motion).
• Czcionki (Space Grotesk, Inter, IBM Plex Mono) ładowane są z Google
  Fonts — wymaga to działającego dostępu do internetu na stronie
  (standard, brak dodatkowej konfiguracji).

KOLORY I TYPOGRAFIA (do dalszej pracy w Figmie/graficznie)
-----------------------------------------------------
Beton / bazalt (tło ciemne):     #221F1C
Piasek (tło jasne):               #EDE6D8
Kamień / beton jasny:             #B4AB9B
Żywica / akcent:                  #B4813F
Żywica jasna (hover/gradient):    #D9AE72
Tekst podstawowy:                 #2A2723

Nagłówki:  Space Grotesk (600/700)
Tekst:     Inter (400/500/600)
Etykiety/dane techniczne: IBM Plex Mono
