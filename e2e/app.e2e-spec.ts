import { NgRispostaPage } from './app.po';

describe('ng-risposta App', () => {
  let page: NgRispostaPage;

  beforeEach(() => {
    page = new NgRispostaPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
