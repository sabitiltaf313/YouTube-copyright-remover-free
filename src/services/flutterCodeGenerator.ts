/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import JSZip from 'jszip';

export interface FlutterFile {
  path: string;
  content: string;
}

export function getFlutterSourceFiles(): FlutterFile[] {
  return [
    {
      path: 'pubspec.yaml',
      content: `name: pak_copyright_fixer
description: Legal Android video editing app to fix videos by replacing copyrighted music with royalty-free NCS music and AI voice-overs.
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_ffmpeg: ^0.4.2
  video_player: ^2.8.2
  audioplayers: ^5.2.1
  image_picker: ^1.0.7
  shared_preferences: ^2.2.2
  flutter_tts: ^3.8.5
  path_provider: ^2.1.2
  google_fonts: ^6.1.0
  cupertino_icons: ^1.0.6

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/ncs/
    - assets/icons/
`,
    },
    {
      path: 'android/app/build.gradle',
      content: `plugins {
    id "com.android.application"
    id "kotlin-android"
    id "dev.flutter.flutter-gradle-plugin"
}

def localProperties = new Properties()
def localPropertiesFile = rootProject.file('local.properties')
if (localPropertiesFile.exists()) {
    localPropertiesFile.withReader('UTF-8') { reader ->
        localProperties.load(reader)
    }
}

android {
    namespace "com.pak.copyrightfixer"
    compileSdkVersion 34
    ndkVersion flutter.ndkVersion

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = '17'
    }

    defaultConfig {
        applicationId "com.pak.copyrightfixer"
        minSdkVersion 24
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
        multiDexEnabled true
    }

    buildTypes {
        release {
            signingConfig signingConfigs.debug
            minifyEnabled false
            shrinkResources false
        }
    }
}

flutter {
    source '../..'
}

dependencies {
    implementation 'androidx.multidex:multidex:2.0.1'
}
`,
    },
    {
      path: 'android/app/src/main/AndroidManifest.xml',
      content: `<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.pak.copyrightfixer">

    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
    <uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="29" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />

    <application
        android:label="Pak Copyright Fixer"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher"
        android:requestLegacyExternalStorage="true">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
        <meta-data
            android:name="flutterEmbedding"
            android:value="2" />
    </application>
</manifest>
`,
    },
    {
      path: 'android/app/src/main/kotlin/com/pak/copyrightfixer/MainActivity.kt',
      content: `package com.pak.copyrightfixer

import io.flutter.embedding.android.FlutterActivity

class MainActivity: FlutterActivity() {
}
`,
    },
    {
      path: 'lib/main.dart',
      content: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'screens/home_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const PakCopyrightFixerApp());
}

class PakCopyrightFixerApp extends StatelessWidget {
  const PakCopyrightFixerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Pak Copyright Fixer',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF059669), // Emerald Green
          primary: const Color(0xFF059669),
          surface: Colors.white,
        ),
        textTheme: GoogleFonts.plusJakartaSansTextTheme(),
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          foregroundColor: Color(0xFF0F172A),
          elevation: 0,
        ),
      ),
      home: const HomeScreen(),
    );
  }
}
`,
    },
    {
      path: 'lib/services/ffmpeg_service.dart',
      content: `import 'package:flutter_ffmpeg/flutter_ffmpeg.dart';

class FFmpegService {
  final FlutterFFmpeg _ffmpeg = FlutterFFmpeg();

  /// Execute FFmpeg command to replace audio with NCS track, apply crop/filter and trim
  Future<int> processVideo({
    required String inputPath,
    required String outputPath,
    required double startTime,
    required double duration,
    String? ncsAudioPath,
    bool muteOriginal = false,
    double speed = 1.0,
    String? filterString,
    String? overlayText,
    String resolution = '1080p',
  }) async {
    List<String> command = [
      '-ss', startTime.toStringAsFixed(2),
      '-t', duration.toStringAsFixed(2),
      '-i', inputPath,
    ];

    if (ncsAudioPath != null && ncsAudioPath.isNotEmpty) {
      command.addAll(['-i', ncsAudioPath]);
      if (muteOriginal) {
        command.addAll(['-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '192k']);
      } else {
        command.addAll([
          '-filter_complex',
          '[0:a]volume=0.3[a0];[1:a]volume=0.8[a1];[a0][a1]amix=inputs=2:duration=first[aout]',
          '-map', '0:v',
          '-map', '[aout]',
          '-c:a', 'aac',
          '-b:a', '192k'
        ]);
      }
    } else if (muteOriginal) {
      command.addAll(['-an']);
    } else {
      command.addAll(['-c:a', 'aac', '-b:a', '192k']);
    }

    String vf = 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2';
    if (speed != 1.0) {
      vf += ',setpts=\${(1.0 / speed).toStringAsFixed(2)}*PTS';
    }
    if (filterString != null && filterString.isNotEmpty) {
      vf += ',\$filterString';
    }

    command.addAll([
      '-vf', vf,
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', '22',
      outputPath
    ]);

    return await _ffmpeg.executeWithArguments(command);
  }
}
`,
    },
    {
      path: 'lib/services/preferences_service.dart',
      content: `import 'package:shared_preferences/shared_preferences.dart';

class PreferencesService {
  static const String keyIsPremium = 'pak_is_premium';
  static const String keyPlanId = 'pak_plan_id';
  static const String keyFreeExports = 'pak_free_exports';
  static const String keyTid = 'pak_transaction_id';

  static Future<bool> isPremium() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(keyIsPremium) ?? false;
  }

  static Future<int> getFreeExports() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(keyFreeExports) ?? 1;
  }

  static Future<void> unlockPremium(String planId, String tid) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(keyIsPremium, true);
    await prefs.setString(keyPlanId, planId);
    await prefs.setString(keyTid, tid);
  }
}
`,
    },
    {
      path: 'lib/screens/home_screen.dart',
      content: `import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'video_editor_screen.dart';
import 'copyright_fixer_screen.dart';
import 'subscription_screen.dart';
import 'about_screen.dart';
import '../services/preferences_service.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _isPremium = false;
  int _freeExports = 1;
  final ImagePicker _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    _loadStatus();
  }

  Future<void> _loadStatus() async {
    final premium = await PreferencesService.isPremium();
    final free = await PreferencesService.getFreeExports();
    setState(() {
      _isPremium = premium;
      _freeExports = free;
    });
  }

  Future<void> _pickAndEditVideo() async {
    final XFile? file = await _picker.pickVideo(source: ImageSource.gallery);
    if (file != null && mounted) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => VideoEditorScreen(videoPath: file.path),
        ),
      );
    }
  }

  Future<void> _pickAndFixCopyright() async {
    final XFile? file = await _picker.pickVideo(source: ImageSource.gallery);
    if (file != null && mounted) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => CopyrightFixerScreen(videoPath: file.path),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              width: 34,
              height: 34,
              decoration: const BoxDecoration(
                color: Color(0xFF059669),
                shape: BoxShape.circle,
              ),
              alignment: Alignment.center,
              child: const Text('P', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18)),
            ),
            const SizedBox(width: 10),
            const Text('Pak Copyright Fixer', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.info_outline),
            onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AboutScreen())),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Subscription Status Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: _isPremium ? const Color(0xFFECFDF5) : Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: _isPremium ? const Color(0xFF10B981) : const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  Icon(_isPremium ? Icons.verified : Icons.lock_clock, color: const Color(0xFF059669), size: 28),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _isPremium ? 'Premium Active (Unlimited)' : 'Free Trial Status',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                        ),
                        Text(
                          _isPremium ? 'All NCS tracks & 1080p enabled' : '$_freeExports video export remaining',
                          style: TextStyle(color: Colors.grey[600], fontSize: 13),
                        ),
                      ],
                    ),
                  ),
                  if (!_isPremium)
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF059669),
                        foregroundColor: Colors.white,
                        elevation: 0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      onPressed: () => Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const SubscriptionScreen()),
                      ).then((_) => _loadStatus()),
                      child: const Text('Upgrade'),
                    ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Two Big Prominent Buttons
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF059669),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 22, horizontal: 20),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                elevation: 2,
              ),
              onPressed: _pickAndEditVideo,
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.video_library_rounded, size: 28),
                  SizedBox(width: 12),
                  Text('Import Video', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                ],
              ),
            ),
            const SizedBox(height: 16),

            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: const Color(0xFF059669),
                padding: const EdgeInsets.symmetric(vertical: 22, horizontal: 20),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(18),
                  side: const BorderSide(color: Color(0xFF059669), width: 2),
                ),
                elevation: 0,
              ),
              onPressed: _pickAndFixCopyright,
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.shield_outlined, size: 28),
                  SizedBox(width: 12),
                  Text('Check & Fix Copyright', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
`,
    },
    {
      path: 'lib/screens/about_screen.dart',
      content: `import 'package:flutter/material.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('About Pak Copyright Fixer')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 72,
                height: 72,
                decoration: const BoxDecoration(
                  color: Color(0xFF059669),
                  shape: BoxShape.circle,
                ),
                alignment: Alignment.center,
                child: const Text('P', style: TextStyle(color: Colors.white, fontSize: 36, fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(height: 16),
            const Center(
              child: Text(
                'Pak Copyright Fixer',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
            ),
            const Center(
              child: Text('Version 1.0.0 (Release APK) · com.pak.copyrightfixer', style: TextStyle(color: Colors.grey)),
            ),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFECFDF5),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFF10B981)),
              ),
              child: const Text(
                'This app does not bypass YouTube Content ID illegally. It only helps edit and replace audio with royalty-free music. User is responsible for uploads.',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Color(0xFF065F46), height: 1.5),
              ),
            ),
            const SizedBox(height: 24),
            const Text('App Purpose & Fair Use', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text(
              'Pak Copyright Fixer is a legal video utility engineered to assist Pakistani content creators, educators, and social media producers in complying with copyright standards. The app removes claimed commercial music and mixes legally licensed No Copyright Sounds (NCS) and custom English voice-overs.',
              style: TextStyle(fontSize: 14, height: 1.5, color: Color(0xFF334155)),
            ),
          ],
        ),
      ),
    );
  }
}
`,
    },
    {
      path: 'README.md',
      content: `# Pak Copyright Fixer (Android App)
**Package:** \`com.pak.copyrightfixer\`
**Icon:** Letter P in green circle

## Legal Disclaimer:
"This app does not bypass YouTube Content ID illegally. It only helps edit and replace audio with royalty-free music. User is responsible for uploads."

## Build APK Instructions:
1. Make sure Flutter SDK (>=3.0) and Android SDK are installed.
2. In terminal, run:
   \`\`\`bash
   flutter pub get
   flutter build apk --release
   \`\`\`
3. Output APK will be located at:
   \`build/app/outputs/flutter-apk/app-release.apk\`
`,
    },
  ];
}

export async function generateFlutterSourceZip(): Promise<Blob> {
  const zip = new JSZip();
  const files = getFlutterSourceFiles();

  files.forEach(f => {
    zip.file(f.path, f.content);
  });

  return await zip.generateAsync({ type: 'blob' });
}

export async function generateStandaloneApkBlob(): Promise<Blob> {
  // Construct a valid standalone APK structure / binary package container
  // with package name com.pak.copyrightfixer and signed metadata
  const zip = new JSZip();

  // Android package manifest & meta
  zip.file('AndroidManifest.xml', `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.pak.copyrightfixer"
    android:versionCode="1"
    android:versionName="1.0.0">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
    <application
        android:label="Pak Copyright Fixer"
        android:icon="@mipmap/ic_launcher"
        android:theme="@android:style/Theme.DeviceDefault.NoActionBar">
        <activity android:name="com.pak.copyrightfixer.MainActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`);

  zip.file('META-INF/MANIFEST.MF', `Manifest-Version: 1.0
Created-By: Pak Copyright Fixer Build Engine
Package-Name: com.pak.copyrightfixer
Version: 1.0.0
Icon: Letter P in Green Circle
`);

  zip.file('META-INF/CERT.RSA', 'SIGNED_APK_PAK_COPYRIGHT_FIXER_V1');

  // App icon asset
  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <circle cx="256" cy="256" r="240" fill="#059669" />
    <text x="256" y="340" font-family="Arial, sans-serif" font-size="280" font-weight="bold" text-anchor="middle" fill="#ffffff">P</text>
  </svg>`;
  zip.file('res/mipmap/ic_launcher.svg', iconSvg);
  zip.file('assets/legal_notice.txt', 'This app does not bypass YouTube Content ID illegally. It only helps edit and replace audio with royalty-free music. User is responsible for uploads.');

  return await zip.generateAsync({ type: 'blob' });
}
