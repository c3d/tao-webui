function tr(key)
{
    var translations = {
        'Themes': 'Thèmes',
        'Vellum': 'Vélin',
        'White': 'Blanc',
        'Tools': 'Outils',
        'Properties': 'Propriétés',
        'Pages': null,
        'Title & Subtitle': 'Titre et Sous-Titre',
        'Title & Bullets': 'Titre et Puces',
        'Title, Bullets & Photo': 'Titre, Puces et Photos',
        'Photo &ndash; Horizontal': 'Photo &ndash; Horizontale',
        'Blank': 'Vide',
        'Delete': 'Supprimer',
        'Delete page': 'Supprimer une page',
        'Are you sure you want to delete this page?': 'Voulez-vous vraiment supprimer cette page ?',
        'New page from this template': 'Nouvelle page',
        'Page name': 'Nom de la page',
        'Title': 'Titre',
        'Subtitle': 'Sous-titre',
        'Photo': null,
        'Caption': 'Légende',
        'Bullet text': 'Corps du texte',
        'New page': 'Nouvelle page',
        '_Theme default_': '_Police du thème_', // Underscores are used in server
        'Move page before': 'Déplacer la page avant',
        'Move page after': 'Déplacer la page après',
        'Move before': 'Déplacer avant',
        'Move after': 'Déplacer après',
        'Image library': 'Bibliothèque d\'images',
        'Image library...': 'Images...',
        'Add URL...': 'Ajouter une URL...',
        'Add image from URL': 'Ajouter une image (URL)',
        'Add file...': 'Ajouter un fichier...',
        'Add image file': 'Ajouter un fichier image',
        'Description': null,
        'Type': null,
        'File': 'Fichier',
        'URL': null,
        'Delete image': 'Supprimer une image',
        'Are you sure you want to delete this image?': 'Voulez-vous vraiment supprimer cette image ?',
        'File': 'Fichier',
        'Browse...': 'Choisir...',
        'Upload failed': 'Erreur de transfert',

        'Blue Claire': 'Bleu Claire',
        'Main Title Slide': 'Titre',
        'Section Slide': 'Section',
        'Picture Slide': 'Image',
        'Slide': 'Texte',
        'Text': 'Texte',
        'Picture': 'Image',
        'Scale (%)': 'Zoom (%)'
    };

    if (key in translations)
    {
        var t = translations[key];
        return t !== null ? t : key;
    }
    else
    {
        console.error('Missing French translation for: \'' + key + '\'');
        return key;
    }
}
