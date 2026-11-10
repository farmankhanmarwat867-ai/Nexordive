import test from 'node:test';
import assert from 'node:assert/strict';
import { executeAction, COMMON_ACTION_OPTIONS } from './actionHandler';

test('COMMON_ACTION_OPTIONS includes About Page action option', () => {
  const aboutOption = COMMON_ACTION_OPTIONS.find((opt) => opt.value === 'about');
  assert.ok(aboutOption, 'About option must exist in COMMON_ACTION_OPTIONS');
  assert.equal(aboutOption?.label, 'About Page');
});

test('executeAction handles start-project by calling onStartProject', () => {
  let startProjectCalled = false;
  executeAction('start-project', {
    onStartProject: () => {
      startProjectCalled = true;
    },
  });
  assert.equal(startProjectCalled, true);
});

test('executeAction falls back to onNavigate contact when onStartProject not provided', () => {
  let navigatedTo = '';
  executeAction('start-project', {
    onNavigate: (page) => {
      navigatedTo = page;
    },
  });
  assert.equal(navigatedTo, 'contact');
});

test('executeAction calls onNavigate for valid pages', () => {
  const pages = ['home', 'about', 'services', 'streamer-assets', 'pricing', 'portfolio', 'contact'];
  for (const page of pages) {
    let navigatedTo = '';
    executeAction(page, {
      onNavigate: (p) => {
        navigatedTo = p;
      },
    });
    assert.equal(navigatedTo, page);
  }
});

test('executeAction handles empty or undefined actions safely without throwing', () => {
  assert.doesNotThrow(() => {
    executeAction(undefined);
    executeAction(null);
    executeAction('');
    executeAction('   ');
  });
});
