describe('Puzzle 415', () => {
  global.testSanity('puzzle415');
  describe('Исходный код', () => {
    it('использует React SSR и статику', async () => {
      const src = await global.getSource('puzzle415', 'server.js');
      expect(src).toContain('express.static');
      expect(src).toContain('public');
      expect(src).toContain('renderToStaticMarkup');
    });
    it('шаблон Login.jsx корректный', async () => {
      const src = await global.getSource('puzzle415', 'views/Login.jsx');
      expect(src).toContain('<form');
      expect(src).toContain('button');
      expect(src).toContain('input');
      expect(src).toContain('name="login"');
      expect(src).toContain('name="password"');
      expect(src).toContain('type="password"');
    });
    it('React-компонент Layout.jsx корректный', async () => {
      const src = await global.getSource('puzzle415', 'views/Layout.jsx');
      expect(src).toContain('/js/client.js');
      expect(src).toContain('<script');
      expect(src).toContain('defer');
      expect(src).toContain('children');
    });
    it('client.js корректный', async () => {
      const src = await global.getSource('puzzle415', 'public/js/client.js');
      expect(src).toContain('document.');
      expect(src).toContain('addEventListener');
      expect(src).toContain('preventDefault()');
      expect(src).toContain('fetch');
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
      await expect(page).toFill('input[name="password"]', 'aabbcc');
      const dialog = await expect(page).toDisplayDialog(async () => {
        await expect(page).toClick('button[type="submit"]');
      });
      expect(dialog.message()).toEqual('Ошибка входа.');
      await dialog.dismiss();
    });
    it('оповещает об успехе при правильном логине', async () => {
      await page.goto(global.makeUrl('/login'));
      await expect(page).toFill('input[name="login"]', 'fedor');
      await expect(page).toFill('input[name="password"]', '123456');
      const dialog = await expect(page).toDisplayDialog(async () => {
        await expect(page).toClick('button[type="submit"]');
      });
      expect(dialog.message()).toEqual('Успешный вход!');
      await dialog.dismiss();
    });
  });
  afterAll(() => global.puzzle415.kill());
});
