/**
 * Fonction jQuery permettant de configurer le DataTable en Français
 */
$(document).ready(function() {
    $('#table-resultat').DataTable( {
        "pagingType": "full_numbers",
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.10.15/i18n/French.json"
        },
        "pageLength": 25,

    } );
} );

/**
 * Fontion jQuery permettant d'afficher dynamiquement les blocs d'information d'une entreprise
 */
$(document).ready(function() {
    $('[id^=detail-]').hide();
    $('.toggle').click(function() {
        $input = $( this );
        $target = $('#'+$input.attr('data-toggle'));
        $target.slideToggle();
    });
});

$(document).ready(function() {
    var choice = select.selectedIndex;
    if( choice == 1){
        document.getElementById("divChoixAutocompletion").style.display='block';
    }
});

/**
 * Fonction de vérification du formulaire
 * Pour SIREN : vérifie si l'utilisateur à bien entré un nombre de 9 chiffres
 * Pour SIRET : vérifie si l'utilisateur à bien entré un nombre de 14 chiffres
 * Pas de vérification pour le nom d'entreprise
 * @returns true si c'est OK false sinon
 */
function validateForm() {
    var select = document.forms["form"]["select"].value;
    if(select == 'siret'){
        if(document.getElementById("selectionOfUser").value.length != 14 || isNaN(document.getElementById("selectionOfUser").value)){
            document.getElementById("divMessageErreur").innerHTML = 'Le numéro de SIRET doit être un nombre de 14 chiffres !';
            return false;
        }
    }
    else if(select == 'siren') {
        if (document.getElementById("selectionOfUser").value.length != 9 || isNaN(document.getElementById("selectionOfUser").value)) {
            document.getElementById("divMessageErreur").innerHTML = 'Le numéro de SIREN doit être un nombre de 9 chiffres !';
            return false;
        }
    }
    return true;
}

function change_valeur() {
    document.getElementById("divMessageErreur").innerHTML = '';
    var choice = select.selectedIndex ;
    if(choice == 1){
        document.getElementById("divChoixAutocompletion").style.display='block';
        document.getElementById('selectionOfUser').placeholder="Taper maintenant le nom d'entreprise";
    }
    else if(choice == 2){
        document.getElementById("divChoixAutocompletion").style.display='none';
        document.getElementById('selectionOfUser').placeholder="Taper maintenant le numéro de SIREN";
    }
    else if(choice == 3){
        document.getElementById("divChoixAutocompletion").style.display='none';
        document.getElementById('selectionOfUser').placeholder="Taper maintenant le numéro de SIRET";
    }
}
