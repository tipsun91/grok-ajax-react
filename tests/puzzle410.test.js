describe('Puzzle 410', () => {
  global.testSanity('puzzle410');
  describe('Исходный код', () => {
    it('использует шаблонизатор и статику', async () => {
      const src = await global.getSource('puzzle410', 'server.js');
      expect(src).toContain('express.static');
      expect(src).toContain('public');
      expect(src).toContain('.render(');
    });
    it('шаблон login.hbs корректный', async () => {
      const src = await global.getSource('puzzle410', 'views/login.hbs');
      expect(src).toContain('<form');
      expect(src).toContain('button');
      expect(src).toContain('input');
      expect(src).toContain('name="login"');
      expect(src).toContain('name="password"');
      expect(src).toContain('type="password"');
    });
    it('шаблон layout.hbs корректный', async () => {
      const src = await global.getSource('puzzle410', 'views/layout.hbs');
      expect(src).toContain('/js/client.js');
      expect(src).toContain('<script');
      expect(src).toContain('defer');
      expect(src).toContain('{{{body}}}');
    });
    it('client.js корректный', async () => {
      const src = await global.getSource('puzzle410', 'public/js/client.js');
      expect(src).toContain('document.');
      expect(src).toContain('addEventListener');
      expect(src).toContain('preventDefault()');
    });
  });
  describe('Страница входа', () => {
    it('содержит форму входа', async () => {
      const res = await global.fetch(`${global.url}/login`);
      expect(res).toContain('<form');
      expect(res).toContain('name="login"');
      expect(res).toContain('name="password"');
    });
    it('выводит ошибку входа при неверном логине', async () => {
      await page.goto(global.makeUrl('/login'));
      await expect(page).toFill('input[name="login"]', 'danya');
      const dialog = await expect(page).toDisplayDialog(async () => {
        await expect(page).toClick('button[type="submit"]');
      });
      expect(dialog.message()).toEqual('Ошибка входа.');
      await dialog.dismiss();
    });
    it('оповещает об успехе при правильном логине', async () => {
      await page.goto(global.makeUrl('/login'));
      await expect(page).toFill('input[name="login"]', 'fedor');
      const dialog = await expect(page).toDisplayDialog(async () => {
        await expect(page).toClick('button[type="submit"]');
      });
      expect(dialog.message()).toEqual('Успешный вход!');
      await dialog.dismiss();
    });
  });
  afterAll(() => global.puzzle410.kill());
});
