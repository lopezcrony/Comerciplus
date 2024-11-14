import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../services/scanner_service.dart';

class ScannerScreen extends StatefulWidget {
  const ScannerScreen({super.key});

  @override
  State<ScannerScreen> createState() => _ScannerScreenState();
}

class _ScannerScreenState extends State<ScannerScreen> {
  final ScannerService _scannerService = ScannerService();
  late MobileScannerController _cameraController;
  bool _isScanning = true;
  String _lastScannedCode = '';
  bool _isProcessing = false;
  DateTime? _lastScanTime;

  @override
  void initState() {
    super.initState();
    _cameraController = MobileScannerController(
      facing: CameraFacing.back,
      formats: [BarcodeFormat.all],
    );
    _initializeScanner();
  }

  Future<void> _initializeScanner() async {
    try {
      await _cameraController.start();
    } catch (e) {
      _showError('Error al iniciar la cámara: $e');
    }
  }

  @override
  void dispose() {
    _cameraController.dispose();
    super.dispose();
  }

  void _resetScanner() {
    setState(() {
      _lastScannedCode = '';
      _isProcessing = false;
      _lastScanTime = null;
    });
  }

  Future<void> _handleBarcodeScan(Barcode barcode) async {
    if (_isProcessing) return;

    final code = barcode.rawValue;
    if (code == null || code.isEmpty) return;

    // Verificar si ha pasado suficiente tiempo desde el último escaneo
    final now = DateTime.now();
    if (_lastScanTime != null) {
      final difference = now.difference(_lastScanTime!);
      if (difference.inSeconds < 2) return; // Esperar 2 segundos entre escaneos
    }

    setState(() {
      _isProcessing = true;
      _lastScannedCode = code;
      _lastScanTime = now;
    });

    try {
      await _scannerService.sendBarcodeToBackend(code);
      _showSuccess('Código escaneado: $code');
    } catch (e) {
      _showError('Error: $e');
    } finally {
      setState(() {
        _isProcessing = false;
      });
    }
  }

  void _showSuccess(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.green,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        duration: const Duration(seconds: 3),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Escáner',
          style: GoogleFonts.poppins(
            color: const Color(0xFF2D3142),
            fontWeight: FontWeight.w600,
          ),
        ),
        actions: [
          // Botón para resetear el escáner
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _resetScanner,
            tooltip: 'Resetear escáner',
          ),
          IconButton(
            icon: Icon(_isScanning ? Icons.pause : Icons.play_arrow),
            onPressed: () {
              setState(() {
                _isScanning = !_isScanning;
                if (_isScanning) {
                  _cameraController.start();
                } else {
                  _cameraController.stop();
                }
              });
            },
          ),
          IconButton(
            icon: const Icon(Icons.flip_camera_ios),
            onPressed: () => _cameraController.switchCamera(),
          ),
          IconButton(
            icon: const Icon(Icons.flashlight_on),
            onPressed: () => _cameraController.toggleTorch(),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: MobileScanner(
                controller: _cameraController,
                onDetect: (capture) {
                  final List<Barcode> barcodes = capture.barcodes;
                  if (barcodes.isNotEmpty) {
                    _handleBarcodeScan(barcodes.first);
                  }
                },
                overlay: Center(
                  child: Container(
                    decoration: BoxDecoration(
                      border: Border.all(
                        color: Colors.green,
                        width: 2,
                      ),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    width: 300,
                    height: 150,
                  ),
                ),
              ),
            ),
          ),
          if (_lastScannedCode.isNotEmpty)
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  Text(
                    'Último código: $_lastScannedCode',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 8),
                  ElevatedButton(
                    onPressed: _resetScanner,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Escanear nuevo código'),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
