/**
 *
 */

'use strict';

import $ from 'jquery';
import {FornaContainer} from './fornac.js';



// Reference Structure
function referenceStructureContainer(structure, sequence) {
    let container = new FornaContainer("#rna_reference",
        {
            'applyForce': true,
            'allowPanningAndZooming': true,
            'initialSize':[400,400]
        });

    let options = {
        'structure': structure,
        'sequence':  sequence
    };
    container.addRNA(options.structure, options);
    container.setSize();
}

// Predicted Structure
function predictedStructureContainer(structure, sequence, reactivity_array) {
    let container = new FornaContainer("#rna_predicted",
        {
            'applyForce': true,
            'allowPanningAndZooming': true,
            'initialSize':[400,400]
        });

    let options = {
        'structure': structure,
        'sequence':  sequence
    };
    container.addRNA(options.structure, options);
    container.setSize();

    container.addCustomColorsText(reactivity_array.join(" "));
}

function updateRNASelection() {

    let $el = $("#rna_select");
    $el.empty(); // remove old options
    $.each(rna_id_array, function(index,value) {
        $el.append($("<option></option>")
            .attr("value", value).text(value));
    });
}

function constructRNAStructureDict() {
    $.each(rna_structure_array, function(index, value) {
        let id = value['rna_id'];
        rna_id_array.push(id);
        rna_structure_dict[id] = value;
    });
}

function updatePageWithRNAID(rnaID) {
    //
    let rna = rna_structure_dict[rnaID];
    let sequence = rna['sequence_string'];
    let reference = rna['reference_structure'];
    let predicted = rna['predicted_structure'];
    let barcode = rna['barcode_string'];
    let reactivity_array = rna['reactivity'];

    $("#rna_id").html(rnaID);
    $("#rna_barcode").html(barcode);
    $("#rna_sequence").html(sequence);
    $("#reference_structure").html(reference);
    $("#predicted_structure").html(predicted);

    //
    referenceStructureContainer(reference, sequence);
    predictedStructureContainer(predicted, sequence, reactivity_array);
}

// Load data
var rna_structure_array = [];
var rna_structure_dict = {};
var rna_id_array = [];
let data_json = 'RNA_Library_Structure-2017-02-01.json';

$.getJSON('data/' + data_json, function(json) {

    // Update page
    $("#date").html(json['date']);

    rna_structure_array = json['items'];

    // Construct `dict` for all RNA Structures, using `RNA ID` as `key`.
    constructRNAStructureDict();

    // Update RNA Selector
    updateRNASelection();

    // Make the first one selected
    if(rna_id_array.length > 0) {
        updatePageWithRNAID(rna_id_array[0])
    }
});

$( "#view_rna" ).click(function() {

    let rnaID = $( "#rna_select" ).val();

    // Update Page based on the ID
    updatePageWithRNAID(rnaID)

});

