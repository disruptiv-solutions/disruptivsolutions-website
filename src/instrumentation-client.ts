import { initBotId } from 'botid/client/core';

initBotId({
  protect: [
    { path: '/api/newsletter-signup', method: 'POST', advancedOptions: { checkLevel: 'basic' } },
    { path: '/api/speaking-inquiry', method: 'POST', advancedOptions: { checkLevel: 'basic' } },
    { path: '/api/project-inquiry', method: 'POST', advancedOptions: { checkLevel: 'basic' } },
  ],
});
