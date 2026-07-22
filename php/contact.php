<?php
/**
 * contact.php
 * Prosty, bezzależnościowy handler formularza kontaktowego.
 * Wysyła wiadomość e-mail funkcją mail() PHP (działa na większości
 * hostingów współdzielonych, np. home.pl, nazwa.pl, cyberfolks, OVH).
 *
 * KONFIGURACJA — zmień tylko te dwie stałe poniżej:
 */

const ODBIORCA_EMAIL   = 'kontakt@twojafirma.pl';   // <-- Twój adres, na który mają przychodzić zapytania
const NAZWA_FIRMY      = 'Nazwa Firmy';              // <-- nazwa wyświetlana w temacie / treści maila

/* ------------------------------------------------------------------ */

header('Content-Type: application/json; charset=utf-8');

// Akceptujemy tylko żądania POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Niedozwolona metoda żądania.']);
    exit;
}

/* ---------- proste ograniczenie częstotliwości (1 wiadomość / 30 s / sesja) ---------- */
session_start();
$now = time();
if (isset($_SESSION['last_contact_submit']) && ($now - $_SESSION['last_contact_submit']) < 30) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Wiadomość została już wysłana. Odczekaj chwilę przed kolejną próbą.']);
    exit;
}

/* ---------- honeypot: pole "website" powinno być puste ---------- */
if (!empty($_POST['website'])) {
    // Prawdopodobny bot — udajemy sukces, nic nie wysyłamy.
    echo json_encode(['success' => true, 'message' => 'Dziękujemy! Wiadomość została wysłana.']);
    exit;
}

/* ---------- pobranie i walidacja danych ---------- */
function clean_text(string $value): string {
    $value = trim($value);
    $value = strip_tags($value);
    // usuwamy znaki, które mogłyby posłużyć do wstrzyknięcia dodatkowych nagłówków e-mail
    $value = str_replace(["\r", "\n", "%0a", "%0d"], '', $value);
    return $value;
}

$imie       = clean_text($_POST['imie'] ?? '');
$telefon    = clean_text($_POST['telefon'] ?? '');
$email      = clean_text($_POST['email'] ?? '');
$temat      = clean_text($_POST['temat'] ?? 'Zapytanie ze strony');
$wiadomosc  = trim(strip_tags($_POST['wiadomosc'] ?? ''));

$bledy = [];

if ($imie === '' || mb_strlen($imie) < 2) {
    $bledy[] = 'Podaj imię i nazwisko.';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $bledy[] = 'Podaj poprawny adres e-mail.';
}
if ($wiadomosc === '' || mb_strlen($wiadomosc) < 5) {
    $bledy[] = 'Treść wiadomości jest zbyt krótka.';
}
if (mb_strlen($imie) > 120 || mb_strlen($wiadomosc) > 4000 || mb_strlen($telefon) > 40) {
    $bledy[] = 'Jedno z pól przekracza dozwoloną długość.';
}

if (!empty($bledy)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => implode(' ', $bledy)]);
    exit;
}

/* ---------- budowa treści maila ---------- */
$dataWyslania = date('Y-m-d H:i');
$ip = $_SERVER['REMOTE_ADDR'] ?? 'nieznane';

$tresc = "Nowe zapytanie ze strony internetowej\n";
$tresc .= "----------------------------------------\n";
$tresc .= "Imię i nazwisko: {$imie}\n";
$tresc .= "E-mail:          {$email}\n";
$tresc .= "Telefon:         " . ($telefon !== '' ? $telefon : '— nie podano —') . "\n";
$tresc .= "Rodzaj powierzchni: {$temat}\n";
$tresc .= "Data:            {$dataWyslania}\n";
$tresc .= "IP:              {$ip}\n";
$tresc .= "----------------------------------------\n\n";
$tresc .= "Treść wiadomości:\n{$wiadomosc}\n";

$temat_maila = '=?UTF-8?B?' . base64_encode('Nowe zapytanie ze strony — ' . NAZWA_FIRMY) . '?=';

// Nagłówki — From musi być adresem z Twojej domeny (wymóg wielu hostingów / SPF),
// dlatego prawdziwy e-mail klienta ustawiamy jako Reply-To.
$domenaNadawcy = 'no-reply@' . preg_replace('/^www\./', '', $_SERVER['HTTP_HOST'] ?? 'twojafirma.pl');

$naglowki = [];
$naglowki[] = 'MIME-Version: 1.0';
$naglowki[] = 'Content-Type: text/plain; charset=UTF-8';
$naglowki[] = 'From: ' . NAZWA_FIRMY . ' <' . $domenaNadawcy . '>';
$naglowki[] = 'Reply-To: ' . $imie . ' <' . $email . '>';
$naglowki[] = 'X-Mailer: PHP/' . phpversion();

$wyslano = @mail(
    ODBIORCA_EMAIL,
    $temat_maila,
    $tresc,
    implode("\r\n", $naglowki)
);

if ($wyslano) {
    $_SESSION['last_contact_submit'] = $now;
    echo json_encode([
        'success' => true,
        'message' => 'Dziękujemy! Wiadomość została wysłana — odezwiemy się wkrótce.',
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Nie udało się wysłać wiadomości. Spróbuj ponownie lub zadzwoń bezpośrednio.',
    ]);
}
