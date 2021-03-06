// allow to delete a post clicking on trash button
$('.trash').on('click', function (event) {
  event.preventDefault();
  console.log('click');
  if (confirm('Just in case, you will delete this post.\nRemember this is a permanent action.\nDo you want to continue?')) {
    const $this = $(this);
    const $parent = $this.parents('.row');
    const itemId = $this.data('id');
    $.ajax({
      url: `/post/${itemId}`,
      type: 'DELETE',
    })
    .done(() => {
      $('.alert.deleted').show('fast').delay(3000).hide('fast');
      $parent.remove();
    })
    .fail(() => {
      $('.alert.error').show('fast').delay(3000).hide('fast');
    });
  }
});
