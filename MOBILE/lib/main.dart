import 'package:comerciplus/screens/home.dart';
import 'package:flutter/material.dart';

import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:intl/date_symbol_data_local.dart';


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
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Login()
    );
  }
}
