// allow to delete a post clicking on trash button
$('.trash').on('click', function () {
  if (confirm('Just in case, you will delete this post.\nRemember this is a permanent action.\nDo you want to continue?')) {
    const $this = $(this);
    const $parent = $this.parents('.row');
    const itemId = $this.data('id');
    $.ajax({
      url: `/post/${itemId}`,
      type: 'DELETE',
    })
    .done(() => {
      alert('done!');
      $parent.remove();
    })
    .fail(() => {
      alert('something goes wrong');
    });
  }
});
