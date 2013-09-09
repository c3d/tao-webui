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
        '_Theme default_', '_Police du thème_',
        'Move before': 'Déplacer avant',
        'Move after': 'Déplacer après',

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
