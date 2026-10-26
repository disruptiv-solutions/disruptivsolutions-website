# Phone checkpoints

1. Confirm the observed device matches the chosen phone. Stop if multiple phones make the target ambiguous.
2. Open the installed app before choosing a default. Launch an actual app shortcut and return.
3. Save a uniquely named local text note, close Capture, and read it again. Reopen the app to verify persistence.
4. Open the app drawer. Check search, an app launch and the return gesture. A downward swipe should close at the top without stealing normal app-list scrolling.
5. Return from Capture and another app several times. Check for blank frames, full-page reloads, keyboard resizing and animation resets. Keep the home view instead of rebuilding a WebView on every Home intent.
6. After the owner selects this as the default Home app, use the system Home gesture and confirm it returns here. Then open Android’s Home app settings and verify the original launcher remains an option.
7. For any added audio capture: check permission denial, tap start/stop, draft playback, named save, delete, recording continuity and actual decoded audio. Do not infer recording success from a moving timer.
8. For any added service: check signed-in ownership, offline failure and duplicate-save retries. Keep credentials on the server. Verify an actual result before labeling a button connected.

Developer references: [connect a device](https://developer.android.com/studio/run/device), [ADB and wireless debugging](https://developer.android.com/tools/adb), [Android HOME category](https://developer.android.com/reference/android/content/Intent#CATEGORY_HOME).
