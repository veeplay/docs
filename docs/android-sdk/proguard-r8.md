---
title: R8 / ProGuard
sidebar_label: R8 / ProGuard
description: What to check in a minified release build when you use the Veeplay Android SDK 3.2.
---

This page only matters if your release build is minified (`minifyEnabled true`). Otherwise there is nothing to do.

## What to do

**To keep your release build exactly as it is today, add one line to your own ProGuard rules:**

```
-dontobfuscate
```

Version 3.1.26's consumer rules contained `-dontobfuscate`, which switched off obfuscation for your whole app, not only for Veeplay. Recent AGP 9 versions already ignore such app-wide options in library rules. Version 3.2's rules cover only Veeplay's own classes, so without the line above, a minified build would start renaming your own classes too.

## Check whether you need it

Open your current release `mapping.txt`. If your own classes are already renamed there (for example `com.example.Foo -> a.b:`), your build is obfuscated today. Nothing changes for you and you do not need the line.

## Obfuscation is optional

Obfuscation is worth having: a smaller app that is harder to reverse-engineer. You can switch it on whenever it suits you. Remove the `-dontobfuscate` line, add keeps for your own reflection (for example Gson models and JavaScript interfaces), and check that your crash reports are deobfuscated. Google Play does this for App Bundles, and the Crashlytics Gradle plugin uploads the mapping file by default.

## What changed in the SDK's rules

The `proguard.txt` inside the AAR changed:

- It no longer applies app-wide options (`-dontobfuscate`, `-optimizationpasses`, `-dontpreverify`, `-dontusemixedcaseclassnames`, `-optimizations`).
- It no longer keeps every public and protected `com.appscend` member, the IMA classes or the `com.google.obf` classes. IMA ships its own rules.
- It ships member-level keeps only.

What stays kept for your app, including your own subclasses and implementations:

- `<init>()` and `type()` of `KRAdapter` and `UnitManager` implementations;
- the static `getPriorityIndex()` of `IVeeplayRenderer` implementations;
- the public methods of `APSMediaPlayerOverlayController` subclasses and `APSFrameworkExtension` implementations;
- `com.appscend.vast.APSVAST*Node` classes with `<init>()` and `initWithNode(APSVASTXMLNode)`;
- the `CREATOR` field of `com.appscend.**` `Parcelable` classes;
- in the Cast artifact: `VeeplayCastExtensionImpl` and its `<init>()`.

## Other things to do

- Remove `android.r8.globalOptionsInConsumerRules.disallowed=false` from your `gradle.properties` if you added it. It is not needed any more.
- If your app uses reflection on SDK classes, add keeps for exactly those classes and members to your own rules. The SDK no longer keeps them for you.
- If your own rules existed only to work around the SDK's global options, you can drop them.
- If something behaves differently only in a minified build, send us the R8 `mapping.txt` and we will help.
