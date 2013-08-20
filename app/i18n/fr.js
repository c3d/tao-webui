function tr(key)
{
    var translations = {
        'Themes & Applications': 'Thèmes et Applications',
        'Page Templates': 'Modèles de Pages',
        'Tools': 'Outils',
        'Properties': 'Propriétés',
        'Pages': null,
        'Title & Subtitle': 'Titre et Sous-Titre',
        'Title & Bullets': 'Titre et Puces',
        'Title, Bullets & Photo': 'Titre, Puces et Photos',
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
