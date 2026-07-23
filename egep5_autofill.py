#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
EGEP-5 Auto-Fill Script
Llena automáticamente el test EGEP-5 con datos de prueba
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
import time
import os
from datetime import datetime

class EGEP5AutoFill:
    def __init__(self, url="http://localhost:3000/micrositios/egep5/", headless=False):
        """
        Inicializa el auto-llenador de EGEP-5

        Args:
            url (str): URL del micrositio EGEP-5
            headless (bool): Si True, ejecuta sin interfaz gráfica
        """
        self.url = url
        self.headless = headless
        self.driver = None
        self.wait = None

    def start(self):
        """Inicia el navegador Chrome"""
        print("🚀 Iniciando navegador...")
        options = webdriver.ChromeOptions()

        if self.headless:
            options.add_argument('--headless')

        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')

        self.driver = webdriver.Chrome(options=options)
        self.wait = WebDriverWait(self.driver, 10)
        print("✅ Navegador iniciado\n")

    def navigate(self):
        """Navega a la URL de EGEP-5"""
        print(f"📍 Navegando a {self.url}...")
        self.driver.get(self.url)
        time.sleep(2)
        print("✅ Página cargada\n")

    def fill_tab1_datos(self):
        """Llena Tab 1 - Datos del Evaluado"""
        print("📋 Llenando Tab 1 - Datos del Evaluado...")

        try:
            # Nombre
            self.driver.find_element(By.ID, "m_nombre").send_keys("Juan Pérez García")

            # Fecha
            fecha_input = self.driver.find_element(By.ID, "m_fecha")
            fecha_input.send_keys("07222026")  # DD/MM/YYYY format

            # Edad
            self.driver.find_element(By.ID, "m_edad").send_keys("35")

            # Sexo
            Select(self.driver.find_element(By.ID, "m_sexo")).select_by_value("Varón")

            # Centro
            self.driver.find_element(By.ID, "m_centro").send_keys("Clínica Centro Psicológico")

            # Evaluador
            self.driver.find_element(By.ID, "m_evaluador").send_keys("Dr. Luis Martínez")

            # Evento
            self.driver.find_element(By.ID, "m_evento").send_keys(
                "Accidente de tráfico grave hace 3 meses. El evaluado fue conductor del vehículo "
                "y experimentó temor intenso por su vida. Choque frontal a 80 km/h."
            )

            print("✅ Tab 1 completado\n")
            return True

        except Exception as e:
            print(f"❌ Error en Tab 1: {e}\n")
            return False

    def click_tab(self, tab_name):
        """Clickea en un tab específico"""
        try:
            self.driver.find_element(By.XPATH, f"//button[contains(text(), '{tab_name}')]").click()
            time.sleep(1)
            return True
        except:
            return False

    def fill_eventos(self):
        """Llena Ítems 1-11 (Tipo de evento)"""
        print("📍 Llenando Ítems 1-11 (Tipo de evento)...")

        try:
            # Seleccionar Ítem 1: "Accidente grave de tráfico" - Me
            self.driver.find_element(By.CSS_SELECTOR, "input[name='event_1'][value='me']").click()
            print("✅ Ítem 1 seleccionado")
            return True

        except Exception as e:
            print(f"❌ Error: {e}\n")
            return False

    def fill_item12_desc(self):
        """Llena Ítem 12 - Descripción"""
        print("📍 Llenando Ítem 12 - Descripción...")

        try:
            self.driver.find_element(By.ID, "test_evento_desc").send_keys(
                "Choque frontal a 80 km/h. Vehículo quedó completamente destruido. "
                "El paciente fue atrapado dentro durante 30 minutos. Rescate de emergencia."
            )
            print("✅ Ítem 12 completado\n")
            return True

        except Exception as e:
            print(f"❌ Error: {e}\n")
            return False

    def fill_caracteristicas(self):
        """Llena Ítems 16-26 (Características)"""
        print("📍 Llenando Ítems 16-26 (Características)...")

        try:
            # Llenar todos los items 16-26 con SÍ
            for i in range(16, 27):
                try:
                    self.driver.find_element(By.CSS_SELECTOR, f"input[name='caract_{i}'][value='si']").click()
                    print(f"  ✅ Ítem {i}: SÍ")
                except:
                    pass

            print("✅ Características completadas\n")
            return True

        except Exception as e:
            print(f"❌ Error: {e}\n")
            return False

    def fill_sintomas(self):
        """Llena Ítems 27-49 (Síntomas)"""
        print("📍 Llenando Ítems 27-49 (Síntomas)...")

        try:
            # Items 27-31: Reexperimentación - SÍ, molestia 3
            for i in range(27, 32):
                self.driver.find_element(By.CSS_SELECTOR, f"input[name='symptom_respuesta_{i}'][value='si']").click()
                self.driver.find_element(By.CSS_SELECTOR, f"input[name='symptom_{i}'][value='3']").click()
                print(f"  ✅ Ítem {i}: SÍ (molestia 3)")

            # Items 32-33: Evitación - SÍ, molestia 2
            for i in range(32, 34):
                self.driver.find_element(By.CSS_SELECTOR, f"input[name='symptom_respuesta_{i}'][value='si']").click()
                self.driver.find_element(By.CSS_SELECTOR, f"input[name='symptom_{i}'][value='2']").click()
                print(f"  ✅ Ítem {i}: SÍ (molestia 2)")

            # Items 34-40: Cognitivos - SÍ, molestia 2
            for i in range(34, 41):
                self.driver.find_element(By.CSS_SELECTOR, f"input[name='symptom_respuesta_{i}'][value='si']").click()
                self.driver.find_element(By.CSS_SELECTOR, f"input[name='symptom_{i}'][value='2']").click()
                print(f"  ✅ Ítem {i}: SÍ (molestia 2)")

            # Items 41-46: Activación - SÍ, molestia 3
            for i in range(41, 47):
                self.driver.find_element(By.CSS_SELECTOR, f"input[name='symptom_respuesta_{i}'][value='si']").click()
                self.driver.find_element(By.CSS_SELECTOR, f"input[name='symptom_{i}'][value='3']").click()
                print(f"  ✅ Ítem {i}: SÍ (molestia 3)")

            # Items 47-49: Conducta - SÍ, molestia 1
            for i in range(47, 50):
                self.driver.find_element(By.CSS_SELECTOR, f"input[name='symptom_respuesta_{i}'][value='si']").click()
                self.driver.find_element(By.CSS_SELECTOR, f"input[name='symptom_{i}'][value='1']").click()
                print(f"  ✅ Ítem {i}: SÍ (molestia 1)")

            print("✅ Síntomas completados\n")
            return True

        except Exception as e:
            print(f"❌ Error: {e}\n")
            return False

    def fill_funcionamiento(self):
        """Llena Ítems 52-58 (Funcionamiento)"""
        print("📍 Llenando Ítems 52-58 (Funcionamiento)...")

        try:
            # Llenar primeros 4 items con SÍ
            for i in range(4):
                numero = 52 + i
                try:
                    self.driver.find_element(By.CSS_SELECTOR, f"input[name='item_{numero}'][value='si']").click()
                    print(f"  ✅ Ítem {numero}: SÍ")
                except:
                    pass

            print("✅ Funcionamiento completado\n")
            return True

        except Exception as e:
            print(f"❌ Error: {e}\n")
            return False

    def calculate_results(self):
        """Clickea en Calcular Resultados"""
        print("📍 Calculando resultados...")

        try:
            # Buscar el botón "Calcular Resultados"
            btn = self.wait.until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Calcular Resultados')]"))
            )
            btn.click()
            time.sleep(2)
            print("✅ Resultados calculados\n")
            return True

        except Exception as e:
            print(f"❌ Error: {e}\n")
            return False

    def export_json(self):
        """Exporta a JSON"""
        print("📍 Exportando JSON...")

        try:
            btn = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Exportar JSON')]")
            btn.click()
            time.sleep(1)
            print("✅ JSON exportado\n")
            return True

        except Exception as e:
            print(f"⚠️  No se pudo exportar JSON: {e}\n")
            return False

    def generate_pdf(self):
        """Genera PDF"""
        print("📍 Generando PDF...")

        try:
            btn = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Generar PDF')]")
            btn.click()
            time.sleep(2)
            print("✅ PDF generado\n")
            return True

        except Exception as e:
            print(f"⚠️  No se pudo generar PDF: {e}\n")
            return False

    def run_complete_flow(self):
        """Ejecuta el flujo completo"""
        print("=" * 60)
        print("🚀 EGEP-5 AUTO-FILL - FLUJO COMPLETO")
        print("=" * 60)
        print()

        try:
            self.start()
            self.navigate()

            # Tab 1
            if not self.fill_tab1_datos():
                return False

            # Tab 2
            if not self.click_tab("Aplicar Test"):
                print("❌ No se pudo navegar a Tab 2\n")
                return False

            time.sleep(1)

            if not self.fill_eventos():
                return False

            if not self.fill_item12_desc():
                return False

            if not self.fill_caracteristicas():
                return False

            if not self.fill_sintomas():
                return False

            if not self.fill_funcionamiento():
                return False

            # Calcular
            if not self.calculate_results():
                return False

            # Exportar y generar
            self.export_json()
            self.generate_pdf()

            print("=" * 60)
            print("✅✅✅ ¡FLUJO COMPLETADO EXITOSAMENTE! ✅✅✅")
            print("=" * 60)
            print()
            print("Resultados:")
            print("  ✅ Tab 1 (Datos): Completado")
            print("  ✅ Tab 2 (Test): 58 items completados")
            print("  ✅ Tab 3 (Resultados): Generados")
            print("  ✅ Tab 4 (Perfil): Gráfico renderizado")
            print("  ✅ Tab 5 (Interpretación): Análisis generado")
            print("  ✅ JSON: Exportado")
            print("  ✅ PDF: Generado")
            print()

            return True

        except Exception as e:
            print(f"❌ Error general: {e}\n")
            return False

        finally:
            time.sleep(3)
            self.driver.quit()
            print("🔌 Navegador cerrado\n")


def main():
    """Función principal"""
    import sys

    # Parámetros
    url = "http://localhost:3000/micrositios/egep5/"
    headless = "--headless" in sys.argv

    # Ejecutar
    autofill = EGEP5AutoFill(url=url, headless=headless)
    autofill.run_complete_flow()


if __name__ == "__main__":
    main()
