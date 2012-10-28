(function () {

    var $button1 = $('#tooltip-1');
    $button1.tooltip({
        maxWidth: 200
    });
    $('[name="tooltip-1"]').change(function () {
        $button1.tooltip('option', 'direction', this.value);
    });

}());