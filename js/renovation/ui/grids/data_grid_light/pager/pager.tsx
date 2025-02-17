/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable max-classes-per-file */
import {
  Component, JSXComponent, ComponentBindings, OneWay, Consumer,
} from '@devextreme-generator/declarations';
import { PlaceholderExtender } from '../../../../utils/plugin/placeholder_extender';

import messageLocalization from '../../../../../localization/message';

import { PagerContent } from '../../../pager/content';
import {
  PageIndex, PageSize, PageCount, SetPageIndex, SetPageSize,
} from '../paging/plugins';
import { TotalCount } from '../data_grid_light';
import { FooterPlaceholder } from '../views/footer';
import { Plugins, PluginsContext } from '../../../../utils/plugin/context';

const DATAGRID_PAGER_CLASS = 'dx-datagrid-pager';

export const viewFunction = ({
  allowedPageSizes, onPageIndexChange, onPageSizeChange,
  props: {
    displayMode, infoText, showInfo, showNavigationButtons, showPageSizeSelector, visible,
  },
}: Pager): JSX.Element => (
  <PlaceholderExtender
    type={FooterPlaceholder}
    order={1}
    deps={[PageIndex, PageSize, TotalCount, PageCount]}
    template={({ deps }): JSX.Element => (
      <PagerContent
        className={DATAGRID_PAGER_CLASS}
        pageSizes={allowedPageSizes}
        displayMode={displayMode}
        infoText={infoText}
        showInfo={showInfo}
        showNavigationButtons={showNavigationButtons}
        showPageSizes={showPageSizeSelector}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        pageCount={deps[3]}
        visible={visible}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        totalCount={deps[2]}

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        pageIndex={deps[0]}
        pageIndexChange={onPageIndexChange}

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        pageSize={deps[1] === 'all' ? 0 : deps[1]}
        pageSizeChange={onPageSizeChange}
      />
    )}
  />
);

@ComponentBindings()
export class PagerProps {
  @OneWay()
  allowedPageSizes: (number | 'all')[] | 'auto' = 'auto';

  @OneWay()
  displayMode: 'adaptive' | 'compact' | 'full' = 'adaptive';

  @OneWay()
  infoText = messageLocalization.format('dxPager-infoText');

  @OneWay()
  showInfo = false;

  @OneWay()
  showNavigationButtons = false;

  @OneWay()
  showPageSizeSelector = false;

  @OneWay()
  visible = true;
}

@Component({
  defaultOptionRules: null,
  jQuery: { register: true },
  view: viewFunction,
})
export class Pager extends JSXComponent(PagerProps) {
  @Consumer(PluginsContext)
  plugins = new Plugins();

  onPageSizeChange(pageSize: number): void {
    const setPageSize = this.plugins.getValue(SetPageSize);
    if (!setPageSize) {
      return;
    }

    if (pageSize === 0) {
      setPageSize('all');
    } else {
      setPageSize(pageSize);
    }
  }

  onPageIndexChange(pageIndex: number): void {
    this.plugins.getValue(SetPageIndex)?.(pageIndex);
  }

  get allowedPageSizes(): (number | 'all')[] {
    const pageSize = this.plugins.getValue(PageSize) ?? 'all';

    if (this.props.allowedPageSizes === 'auto') {
      if (pageSize === 'all') {
        return [];
      }
      return [
        Math.floor(pageSize / 2),
        pageSize,
        pageSize * 2,
      ];
    }

    return this.props.allowedPageSizes;
  }
}
