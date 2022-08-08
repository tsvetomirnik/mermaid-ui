import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './components/icon/icon.component';
import { ButtonDirective } from './directives/button.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [IconComponent, ButtonDirective],
  exports: [IconComponent, ButtonDirective],
})
export class SharedModule {}
