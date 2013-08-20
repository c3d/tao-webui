function tr(key)
{
    var translations = {
        'Themes & Applications': 'Thèmes et Applications',
        'Page Templates (Vellum)': 'Modèles de Pages (<i>Vellum</i>)',
        'Page Templates (White)': 'Modèles de Pages (<i>White</i>)',
        'Tools': 'Outils',
        'Properties': 'Propriétés',
        'Pages': null,
        'Title & Subtitle': 'Titre et Sous-Titre',
        'Title & Bullets': 'Titre et Puces',
        'Title, Bullets & Photo': 'Titre, Puces et Photos',
        'Photo &ndash; Horizontal': 'Photo &ndash; Horizontale',
        'Blank': 'Vide'
    };

    if (key in translations)
    {
        var t = translations[key];
        console.log(t);
        return t !== null ? t : key;
    }
    else
    {
        console.error('Missing French translation for: \'' + key + '\'');
        return key;
    }
}
