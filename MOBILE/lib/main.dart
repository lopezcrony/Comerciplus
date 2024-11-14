import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/date_symbol_data_local.dart';

import 'screens/home.dart';
import 'screens/login.dart';

void main() async {
  await dotenv.load(fileName: "assets/.env");
  await initializeDateFormatting('es', null);

  runApp(const MainApp());
}

class MainApp extends
 StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        textTheme: GoogleFonts.poppinsTextTheme(
          Theme.of(context).textTheme,
        ),
      ),
      home: const Login()
    );
  }
}
