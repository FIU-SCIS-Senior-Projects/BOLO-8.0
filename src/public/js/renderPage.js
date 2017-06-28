var filterSelector = $('#filter');
var agencyFilterSelector = $('#agencyFilter');
var agencyFilterSelectorDiv = $('#agencyFilterDiv');
const myAgencyInternalsFilterSelectorDiv = $('#myAgencyInternalsFilterDiv');
const myAgencyInternalsFilterSelector = $('#myAgencyInternalsFilter');

var renderPage = function (bolosPerPage, visibleNumbers) {
    const filterValue = filterSelector.val();
    console.log(filterValue);
    const agencyFilterValue = agencyFilterSelector.val();
    const onlyMyAgencyInternals = myAgencyInternalsFilterSelector.val() !== 'allAgencies' ?  'true' : '';
    console.log(agencyFilterValue);
    const listOfBoloThumbnails = $('.thumbnail');
    console.log($('#input').val());
    const archivedBolos = $('#input').val() == 'archived';
    var boloDiv = $('#bolo-list');
    var pagingDiv = $('#bolo-paging');

    $.ajax({
        url: '/bolo/list', type: 'GET',
        data: {
          onlyMyAgencyInternals,
          filter: filterValue,
          agency: agencyFilterValue,
          archived: archivedBolos
        },
        success: function (response) {
            if (!response) {
                $('#purge').hide();
                $('#purgeRange').hide();
                pagingDiv.hide();
                boloDiv.empty();
                boloDiv.append('<p class="text-success" style="font-size:xx-large">No Bolos To Show</p>');
            } else {
                var Title = agencyFilterValue === '' ?
                  filterSelector.find("option:selected").text() :
                  agencyFilterSelector.find("option:selected").text();
                console.log(Title);
                $('#purge').show();
                $('#purgeRange').show();
                pagingDiv.show();
                boloDiv.empty();
                boloDiv.append();
                boloDiv.append(response);
                boloDiv.children().hide();
                boloDiv.children().slice(0, bolosPerPage).show();
                $(function () {
                    pagingDiv.twbsPagination({
                        totalPages: listOfBoloThumbnails.length <= bolosPerPage ?
                            1 : Math.floor(listOfBoloThumbnails.length / bolosPerPage),
                        visiblePages: visibleNumbers,
                        prev: '&laquo;',
                        next: '&raquo;',
                        onPageClick: function (event, page) {
                            boloDiv.children().hide();
                            var start = (page - 1) * bolosPerPage;
                            var end = start + bolosPerPage;
                            boloDiv.children().slice(start, end).show();
                        }
                    });
                });
            }
        }
    })
};

$(document).ready(function () {
    agencyFilterSelectorDiv.hide();
    myAgencyInternalsFilterSelectorDiv.hide();
    renderPage(12, 8);
});

//When you change the filter, render the selected bolos, and the paging
filterSelector.change(function () {
    if (filterSelector.val() === 'selectedAgency') {
        agencyFilterSelectorDiv.show();
    } else {
        agencyFilterSelectorDiv.hide();
    }

    if (filterSelector.val() === 'internal') {
      myAgencyInternalsFilterSelectorDiv.show();
    } else {
      myAgencyInternalsFilterSelectorDiv.hide();
    }

    if (filterSelector.val() != 'selectedAgency' ||
    agencyFilterSelector.val() != "") {
      renderPage(12, 8);
    }
});

//When you change the agency filter, render all the agencies bolos, and the paging
agencyFilterSelector.change(function () {
  renderPage(12, 8);
});

myAgencyInternalsFilterSelector.change(function() {
  renderPage(12, 8);
})
