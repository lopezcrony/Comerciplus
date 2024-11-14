import 'package:flutter/material.dart';
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

  Future<void> _handleBarcodeScan(Barcode barcode) async {
    if (_isProcessing) return; // Evita múltiples escaneos simultáneos
    
    final code = barcode.rawValue;
    if (code == null || code.isEmpty || code == _lastScannedCode) return;

    setState(() {
      _isProcessing = true;
      _lastScannedCode = code;
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
      
      // Pequeña pausa antes de permitir otro escaneo
      await Future.delayed(const Duration(seconds: 1));
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
        title: const Text('Escáner'),
        actions: [
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
              child: Text(
                'Último código: $_lastScannedCode',
                style: Theme.of(context).textTheme.titleMedium,
              ),
            ),
        ],
      ),
    );
  }
}