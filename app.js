document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('signature-pad');
    const signaturePad = new SignaturePad(canvas);

    // Redimensionner le canvas pour une meilleure résolution
    function resizeCanvas() {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Effacer la signature
    document.getElementById('clear-signature').addEventListener('click', function () {
        signaturePad.clear();
    });

    // Fonction pour sauvegarder la page
    function savePage() {
        const content = document.body.innerHTML;
        const blob = new Blob([content], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'rapport_ronde.html';
        link.click();
    }

    window.savePage = savePage;

    // Fonction pour afficher l'heure dynamique
    function updateDateTime() {
        const now = new Date();
        const formattedDateTime = now.toLocaleString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('datetime').textContent = formattedDateTime;
    }

    // Mettre à jour l'heure chaque seconde
    setInterval(updateDateTime, 1000);

    // Appeler la fonction immédiatement au chargement
    updateDateTime();

    // Enregistrer le Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('Service Worker enregistré'))
            .catch((err) => console.error('Échec de l\'enregistrement du Service Worker', err));
    }

    // Fonction pour sauvegarder le rapport localement
    function saveReportLocally(report) {
        const reports = JSON.parse(localStorage.getItem('reports') || '[]');
        reports.push(report);
        localStorage.setItem('reports', JSON.stringify(reports));
    }

    // Fonction pour charger les rapports depuis le stockage local
    function loadReports() {
        const reports = JSON.parse(localStorage.getItem('reports') || '[]');
        const reportsContainer = document.getElementById('reports-container');
        reportsContainer.innerHTML = '';
        reports.forEach((report, index) => {
            const reportElement = document.createElement('div');
            reportElement.className = 'report';
            reportElement.textContent = `Report ${index + 1}: ${report}`;
            reportsContainer.appendChild(reportElement);
        });
    }

    // Charger les rapports au chargement de la page
    loadReports();

    // Fonction pour enregistrer le formulaire en PDF
    window.saveAsPDF = function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.text("Gestion des Rondes des Techniciens", 10, 10);
        doc.text("Vérifications", 10, 20);
        // Ajoutez ici le contenu de votre formulaire
        doc.text("Niveau d'huile des extrudeuses: " + document.querySelector('input[name="niveau_huile_extrudeuses"]:checked').value, 10, 30);
        doc.text("Heure L400 PVC: " + document.querySelector('input[placeholder="Chiffres"]').value, 10, 40);
        // Ajoutez les autres champs de formulaire de manière similaire

        doc.save('rapport_ronde.pdf');
    }

    // Fonction pour enregistrer le formulaire en DOC
    window.saveAsDOC = function() {
        const { Document, Packer, Paragraph, TextRun } = window.docx;

        const doc = new Document();
        doc.addSection({
            children: [
                new Paragraph({
                    children: [
                        new TextRun("Gestion des Rondes des Techniciens").bold(),
                        new TextRun("\n\nVérifications"),
                        new TextRun("\nNiveau d'huile des extrudeuses: " + document.querySelector('input[name="niveau_huile_extrudeuses"]:checked').value),
                        new TextRun("\nHeure L400 PVC: " + document.querySelector('input[placeholder="Chiffres"]').value),
                        // Ajoutez les autres champs de formulaire de manière similaire
                    ],
                }),
            ],
        });

        Packer.toBlob(doc).then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'rapport_ronde.docx';
            link.click();
        });
    }
});
