const getUi = () => {
  return DocumentApp.getUi();
};

export const onOpen = () => {
  const menu = getUi()
    .createMenu('My Sample React Project') // edit me!
    .addItem('Sheet Editor (MUI)', 'openDialogMUI')
    .addItem('Sidebar', 'openAboutSidebar');

  menu.addToUi();
};

export const openDialogMUI = () => {
  const html = HtmlService.createHtmlOutputFromFile('dialog-demo-mui')
    .setWidth(600)
    .setHeight(600);
  getUi().showModalDialog(html, 'Sheet Editor (MUI)');
};

export const openAboutSidebar = () => {
  const html = HtmlService.createHtmlOutputFromFile('sidebar-about-page');
  getUi().showSidebar(html);
};
