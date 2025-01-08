import { Component, HostListener, OnInit } from "@angular/core";
import { WidgetSetupService } from "src/app/Services/widget-setup-service.service";

@Component({
  selector: "vex-widegt-preview",
  templateUrl: "./widegt-preview.component.html",
  styleUrls: ["./widegt-preview.component.scss"],
})
export class WidegtPreviewComponent implements OnInit {
  private isDragging = false;
  private initialX: number;
  private initialY: number;
  private offsetX = 0;
  private offsetY = 0;
  public isElementVisible: boolean;
  isActive = false;

  @HostListener("document:mouseup", ["$event"])
  @HostListener("document:mouseleave", ["$event"])
  onMouseUp(event: MouseEvent) {
    if (this.isDragging) {
      this.isDragging = false;
      event.preventDefault();
      event.stopPropagation();
    }
  }

  constructor(private WidgetSetupService: WidgetSetupService) {
    this.isElementVisible = false;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isElementVisible = true;
      this.WidgetSetupService.isElementVisible$.subscribe((value) => {
        this.isElementVisible = value;
      });
    }, 700);
  }

  toggleActive() {
    this.isActive = !this.isActive;
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const divElement = document.querySelector(".reply");
    if (divElement && !divElement.contains(target)) {
      this.isActive = false;
    }
  }

  @HostListener("document:mousemove", ["$event"])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;

    event.preventDefault();
    event.stopPropagation();

    const dx = event.clientX - this.initialX;
    const dy = event.clientY - this.initialY;

    this.offsetX += dx;
    this.offsetY += dy;

    this.initialX = event.clientX;
    this.initialY = event.clientY;

    this.moveElement();
  }

  onDragStart(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.isDragging = true;
    this.initialX = event.clientX;
    this.initialY = event.clientY;

    this.moveElement();
  }

  private moveElement() {
    const element = document.getElementById("draggable-element");

    if (element) {
      element.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px)`;
    }
  }
}
